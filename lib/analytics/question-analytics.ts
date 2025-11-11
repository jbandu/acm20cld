/**
 * Question Analytics
 *
 * Tracks performance metrics for suggested questions
 * to continuously improve the recommendation system.
 */

import { prisma } from "@/lib/db/prisma";
import type { QuestionCategory, QuestionSource } from "@prisma/client";

export interface QuestionMetrics {
  totalDisplayed: number;
  totalClicked: number;
  totalDismissed: number;
  totalExecuted: number;
  clickThroughRate: number;
  executionRate: number;
  dismissalRate: number;
  avgTimeToClick: number; // in milliseconds
  byCategory: Record<string, CategoryMetrics>;
  bySource: Record<string, SourceMetrics>;
}

export interface CategoryMetrics {
  displayed: number;
  clicked: number;
  executed: number;
  dismissed: number;
  ctr: number; // Click-through rate
  executionRate: number;
}

export interface SourceMetrics {
  displayed: number;
  clicked: number;
  executed: number;
  avgScore: number;
  ctr: number;
}

export class QuestionAnalytics {
  /**
   * Analyze overall question performance for a time period
   */
  async analyzePerformance(days: number = 30): Promise<QuestionMetrics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const questions = await prisma.suggestedQuestion.findMany({
      where: {
        displayed: true,
        displayedAt: {
          gte: startDate,
        },
      },
    });

    const metrics: QuestionMetrics = {
      totalDisplayed: questions.length,
      totalClicked: questions.filter((q) => q.clicked).length,
      totalDismissed: questions.filter((q) => q.dismissed).length,
      totalExecuted: questions.filter((q) => q.executed).length,
      clickThroughRate: 0,
      executionRate: 0,
      dismissalRate: 0,
      avgTimeToClick: 0,
      byCategory: {},
      bySource: {},
    };

    // Calculate rates
    if (metrics.totalDisplayed > 0) {
      metrics.clickThroughRate = metrics.totalClicked / metrics.totalDisplayed;
      metrics.executionRate = metrics.totalExecuted / metrics.totalDisplayed;
      metrics.dismissalRate = metrics.totalDismissed / metrics.totalDisplayed;
    }

    // Calculate average time to click
    const clickedQuestions = questions.filter(
      (q) => q.clicked && q.clickedAt && q.displayedAt
    );
    if (clickedQuestions.length > 0) {
      const totalTime = clickedQuestions.reduce((sum, q) => {
        const timeToClick = q.clickedAt!.getTime() - q.displayedAt!.getTime();
        return sum + timeToClick;
      }, 0);
      metrics.avgTimeToClick = totalTime / clickedQuestions.length;
    }

    // Analyze by category
    const categories = new Set(questions.map((q) => q.category));
    for (const category of categories) {
      const categoryQuestions = questions.filter((q) => q.category === category);
      const displayed = categoryQuestions.length;
      const clicked = categoryQuestions.filter((q) => q.clicked).length;
      const executed = categoryQuestions.filter((q) => q.executed).length;
      const dismissed = categoryQuestions.filter((q) => q.dismissed).length;

      metrics.byCategory[category] = {
        displayed,
        clicked,
        executed,
        dismissed,
        ctr: displayed > 0 ? clicked / displayed : 0,
        executionRate: displayed > 0 ? executed / displayed : 0,
      };
    }

    // Analyze by source
    const sources = new Set(questions.map((q) => q.sourceType));
    for (const source of sources) {
      const sourceQuestions = questions.filter((q) => q.sourceType === source);
      const displayed = sourceQuestions.length;
      const clicked = sourceQuestions.filter((q) => q.clicked).length;
      const executed = sourceQuestions.filter((q) => q.executed).length;
      const avgScore =
        sourceQuestions.reduce((sum, q) => sum + q.overallScore, 0) / displayed;

      metrics.bySource[source] = {
        displayed,
        clicked,
        executed,
        avgScore,
        ctr: displayed > 0 ? clicked / displayed : 0,
      };
    }

    return metrics;
  }

  /**
   * Get top performing question categories
   */
  async getTopCategories(limit: number = 5): Promise<
    Array<{
      category: QuestionCategory;
      score: number;
      metrics: CategoryMetrics;
    }>
  > {
    const performance = await this.analyzePerformance(30);

    return Object.entries(performance.byCategory)
      .map(([category, metrics]) => ({
        category: category as QuestionCategory,
        score: metrics.ctr * 0.5 + metrics.executionRate * 0.5,
        metrics,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get recommendations for improving question generation
   */
  async getFeedbackLoop(): Promise<{
    prioritizeCategories: QuestionCategory[];
    deprioritizeCategories: QuestionCategory[];
    prioritizeSources: QuestionSource[];
    suggestions: string[];
  }> {
    const performance = await this.analyzePerformance(30);

    // Identify best and worst performing categories
    const categoryScores = Object.entries(performance.byCategory).map(
      ([category, metrics]) => ({
        category: category as QuestionCategory,
        score: metrics.ctr * 0.5 + metrics.executionRate * 0.5,
        metrics,
      })
    );

    categoryScores.sort((a, b) => b.score - a.score);

    const prioritizeCategories = categoryScores
      .slice(0, 3)
      .map((c) => c.category);

    const deprioritizeCategories = categoryScores
      .slice(-2)
      .filter((c) => c.score < 0.1)
      .map((c) => c.category);

    // Identify best sources
    const sourceScores = Object.entries(performance.bySource).map(
      ([source, metrics]) => ({
        source: source as QuestionSource,
        score: metrics.ctr * 0.4 + metrics.avgScore * 0.6,
        metrics,
      })
    );

    sourceScores.sort((a, b) => b.score - a.score);

    const prioritizeSources = sourceScores.slice(0, 2).map((s) => s.source);

    // Generate suggestions
    const suggestions: string[] = [];

    if (performance.clickThroughRate < 0.2) {
      suggestions.push(
        "Low CTR - Consider making questions more specific and actionable"
      );
    }

    if (performance.executionRate < 0.1) {
      suggestions.push(
        "Low execution rate - Questions may not align well with user intent"
      );
    }

    if (performance.dismissalRate > 0.3) {
      suggestions.push(
        "High dismissal rate - Review question relevance and diversity"
      );
    }

    if (categoryScores.length > 0 && categoryScores[0].score > 0.5) {
      suggestions.push(
        `${categoryScores[0].category} questions perform well - generate more`
      );
    }

    return {
      prioritizeCategories,
      deprioritizeCategories,
      prioritizeSources,
      suggestions,
    };
  }

  /**
   * Track when a suggested question is executed
   */
  async trackQuestionExecution(
    userId: string,
    question: string,
    queryId: string
  ): Promise<void> {
    try {
      // Find the suggested question that matches
      const suggestedQuestion = await prisma.suggestedQuestion.findFirst({
        where: {
          userId,
          question,
          clicked: true,
        },
        orderBy: {
          clickedAt: "desc",
        },
      });

      if (suggestedQuestion) {
        await prisma.suggestedQuestion.update({
          where: { id: suggestedQuestion.id },
          data: {
            executed: true,
            executedQueryId: queryId,
          },
        });
      }
    } catch (error) {
      console.error("Error tracking question execution:", error);
    }
  }

  /**
   * Get user-specific question performance
   */
  async getUserMetrics(userId: string): Promise<{
    totalSuggestions: number;
    clicked: number;
    executed: number;
    favoriteCategories: QuestionCategory[];
  }> {
    const questions = await prisma.suggestedQuestion.findMany({
      where: {
        userId,
        displayed: true,
      },
    });

    const clicked = questions.filter((q) => q.clicked).length;
    const executed = questions.filter((q) => q.executed).length;

    // Find favorite categories (most clicked)
    const categoryClicks = new Map<QuestionCategory, number>();
    questions
      .filter((q) => q.clicked)
      .forEach((q) => {
        categoryClicks.set(q.category, (categoryClicks.get(q.category) || 0) + 1);
      });

    const favoriteCategories = Array.from(categoryClicks.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    return {
      totalSuggestions: questions.length,
      clicked,
      executed,
      favoriteCategories,
    };
  }

  /**
   * Clean up expired questions
   */
  async cleanupExpiredQuestions(): Promise<number> {
    const result = await prisma.suggestedQuestion.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Generate analytics report
   */
  async generateReport(days: number = 30): Promise<string> {
    const metrics = await this.analyzePerformance(days);
    const feedback = await this.getFeedbackLoop();

    let report = `# Question Suggestion Analytics Report\n\n`;
    report += `**Period:** Last ${days} days\n\n`;

    report += `## Overview\n`;
    report += `- Total Displayed: ${metrics.totalDisplayed}\n`;
    report += `- Total Clicked: ${metrics.totalClicked}\n`;
    report += `- Total Executed: ${metrics.totalExecuted}\n`;
    report += `- Click-Through Rate: ${(metrics.clickThroughRate * 100).toFixed(1)}%\n`;
    report += `- Execution Rate: ${(metrics.executionRate * 100).toFixed(1)}%\n`;
    report += `- Dismissal Rate: ${(metrics.dismissalRate * 100).toFixed(1)}%\n\n`;

    report += `## Category Performance\n`;
    Object.entries(metrics.byCategory)
      .sort((a, b) => b[1].ctr - a[1].ctr)
      .forEach(([category, m]) => {
        report += `- **${category}**: CTR ${(m.ctr * 100).toFixed(1)}%, Execution ${(m.executionRate * 100).toFixed(1)}%\n`;
      });

    report += `\n## Source Performance\n`;
    Object.entries(metrics.bySource)
      .sort((a, b) => b[1].ctr - a[1].ctr)
      .forEach(([source, m]) => {
        report += `- **${source}**: CTR ${(m.ctr * 100).toFixed(1)}%, Avg Score ${m.avgScore.toFixed(2)}\n`;
      });

    report += `\n## Recommendations\n`;
    feedback.suggestions.forEach((s) => {
      report += `- ${s}\n`;
    });

    return report;
  }
}
