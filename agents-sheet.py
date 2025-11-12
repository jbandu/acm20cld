function buildAgentForce() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Helpers
  const hex = (c) => c;
  const bold = (range) => range.setFontWeight('bold');

  // Colors (from spec)
  const colors = {
    purpleGrad: hex('#8B5CF6'), // approximate solid for gradient
    lightPurple: hex('#F3E8FF'),
    lightBlue: hex('#DBEAFE'),
    darkGray: hex('#374151'),
    white: hex('#FFFFFF'),
    purple: hex('#A78BFA'),
    blue: hex('#60A5FA'),
    green: hex('#34D399'),
    orange: hex('#FB923C'),
    cyan: hex('#22D3EE'),
    pink: hex('#F472B6'),
    yellow: hex('#FBBF24'),
    red: hex('#EF4444'),
    indigo: hex('#6366F1'),
    lightGray: hex('#E5E7EB'),
    black: hex('#000000'),
    amber: hex('#F59E0B'),
    gray700: hex('#6B7280'),
    blue500: hex('#3B82F6'),
    green500: hex('#10B981'),
    red600: hex('#DC2626')
  };

  // Sheet names
  const SHEET_MAIN = 'Agent Portfolio';
  const SHEET_QUICK = 'Quick Wins';
  const SHEET_ROADMAP = 'Build Roadmap';

  // Recreate sheets cleanly
  [SHEET_MAIN, SHEET_QUICK, SHEET_ROADMAP].forEach(name => {
    const ex = ss.getSheetByName(name);
    if (ex) ss.deleteSheet(ex);
  });

  const main = ss.insertSheet(SHEET_MAIN);
  const quick = ss.insertSheet(SHEET_QUICK);
  const roadmap = ss.insertSheet(SHEET_ROADMAP);

  // === MAIN SHEET HEADER SECTION (Rows 1-5) ===
  main.getRange('A1:J1').merge();
  main.getRange('A2:J2').merge();
  main.getRange('A4:J4').merge();

  main.getRange('A1').setValue("🤖 MADHAVAN'S AI AGENT FORCE\nIntelligent Agents to 10x Your\nExecutive Leverage")
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true).setFontColor(colors.white).setBackground(colors.purpleGrad).setFontSize(24).setFontWeight('bold');

  main.setRowHeights(1, 1, 72);

  main.getRange('A2').setValue("Total Time Saved: 67 hours/week\nYour Current Week: 80 hours →\nFuture Week: 40 hours strategic")
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true).setBackground(colors.lightPurple).setFontSize(14);

  main.setRowHeights(2, 1, 60);

  // Row 3 spacing
  main.getRange('A3:J3').setValue('');

  main.getRange('A4').setValue("INSTRUCTIONS: Rate each agent 1-5 (1=Low Priority, 5=Critical)\nWe'll build your top 5 first")
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true).setBackground(colors.lightBlue).setFontSize(12).setFontStyle('italic');

  // Row 5 spacing
  main.getRange('A5:J5').setValue('');

  // === COLUMN HEADERS (ROW 6) ===
  const headers = [
    'Priority', 'Area', 'Agent Name', 'What It Does', 'Time Saved/Week',
    'Business Impact', 'Build Complexity', 'Status', 'Your Notes', 'Quick Win?'
  ];
  main.getRange(6, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setFontSize(11)
    .setBackground(colors.darkGray).setFontColor(colors.white)
    .setHorizontalAlignment('center');

  // Freeze headers
  main.setFrozenRows(6);

  // Column widths
  const widths = [80,150,200,350,120,120,120,100,250,80];
  widths.forEach((w, i) => main.setColumnWidth(i+1, w));

  // === DATA BLOCKS ===
  // Helper to add a category header row (merged A:J)
  function addCategoryRow(row, label, bgColor, fontColor = colors.white) {
    main.getRange(row, 1, 1, 10).merge();
    main.getRange(row, 1).setValue(label)
      .setBackground(bgColor).setFontColor(fontColor).setFontSize(12).setFontWeight('bold')
      .setHorizontalAlignment('left').setVerticalAlignment('middle');
  }

  // Helper to add an agent row (single row of data)
  function agentRow(row, arr) {
    main.getRange(row, 1, 1, 10).setValues([arr]);
    // Wrap text for description + notes
    main.getRange(row, 4).setWrap(true);
    main.getRange(row, 9).setWrap(true);
    // Center some cols
    main.getRange(row, 1).setHorizontalAlignment('center');
    main.getRange(row, 5).setHorizontalAlignment('center');
    main.getRange(row, 6).setHorizontalAlignment('center');
    main.getRange(row, 7).setHorizontalAlignment('center');
    main.getRange(row, 8).setHorizontalAlignment('center');
    main.getRange(row, 10).setHorizontalAlignment('center');
  }

  // Row tracker
  let r = 7;

  // STRATEGIC INTELLIGENCE
  addCategoryRow(r, '🎯 STRATEGIC INTELLIGENCE', colors.purple); r++;
  agentRow(r++, ['','Strategic Intelligence','Competitive Intelligence Agent','Monitors 20+ competitors daily - tracks publications, patents, clinical trials. Alerts on significant developments.','3 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Strategic Intelligence','Research Trend Scanner','Identifies emerging cancer research trends 6-12 months before mainstream through citation velocity analysis.','2 hours','HIGH','High','Not Started','', true]);
  agentRow(r++, ['','Strategic Intelligence','IP Landscape Monitor','Tracks patent landscape, identifies freedom-to-operate risks and white space opportunities.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Strategic Intelligence','Grant Intelligence Agent','Finds relevant grants (NIH, NSF, DOD), analyzes winning proposals, estimates success probability.','3 hours','HIGH','Medium','Not Started','', true]);

  // spacing
  r++; // empty row

  // INVESTOR RELATIONS
  addCategoryRow(r, '💼 INVESTOR RELATIONS', colors.blue); r++;
  agentRow(r++, ['','Investor Relations','Investor Update Generator','Auto-generates weekly/monthly investor updates from research progress, milestones, and achievements.','4 hours','HIGH','Low','Not Started','', true]);
  agentRow(r++, ['','Investor Relations','Pitch Deck Intelligence','Keeps pitch deck current with latest milestones, competitive landscape, publications, team accomplishments.','2 hours','MEDIUM','Low','Not Started','', true]);
  agentRow(r++, ['','Investor Relations','Fundraising Opportunity Scanner','Identifies potential investors, tracks VC fund raises, suggests timing and warm intro paths.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Investor Relations','Grant Writing Assistant','Helps write and improve grant proposals based on winning examples and reviewer feedback patterns.','3 hours','HIGH','High','Not Started','', false]);

  // spacing
  r++;

  // RESEARCH OVERSIGHT
  addCategoryRow(r, '🔬 RESEARCH OVERSIGHT', colors.green); r++;
  agentRow(r++, ['','Research Oversight','Breakthrough Detector','Flags significant research findings from team before formal reporting. Suggests patent opportunities.','1 hour','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Research Oversight','Research Portfolio Dashboard','Real-time view of all projects: status, blockers, dependencies, timeline, risk flags.','2 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Research Oversight','Publication Opportunity Finder','Matches research to journals, estimates acceptance likelihood, tracks submission deadlines.','1 hour','MEDIUM','Low','Not Started','', false]);
  agentRow(r++, ['','Research Oversight','Collaboration Matchmaker','Identifies external collaboration opportunities, finds complementary research partners.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Research Oversight','Research ROI Tracker','Tracks cost per publication, grant success rates, program efficiency across all research areas.','1 hour','MEDIUM','Low','Not Started','', false]);

  // spacing
  r++;

  // TEAM MANAGEMENT
  addCategoryRow(r, '👥 TEAM MANAGEMENT', colors.orange); r++;
  agentRow(r++, ['','Team Management','Team Health Monitor','Analyzes communication patterns to detect burnout, disengagement before they escalate.','1 hour','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Team Management','Talent Pipeline Agent','Monitors top researchers in your field for hiring. Tracks publication records, identifies unhappy researchers.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Team Management','Productivity Insights','Shows team blockers without micromanaging. Identifies bottlenecks and suggests process improvements.','1 hour','MEDIUM','Low','Not Started','', false]);
  agentRow(r++, ['','Team Management','Onboarding Accelerator','Creates personalized onboarding plans for new hires based on role and background.','1 hour','LOW','Low','Not Started','', false]);

  // spacing
  r++;

  // BUSINESS DEVELOPMENT
  addCategoryRow(r, '🤝 BUSINESS DEVELOPMENT', colors.cyan); r++;
  agentRow(r++, ['','Business Development','Partnership Opportunity Scanner','Finds pharma/biotech working on complementary research. Identifies partnership fit and warm intros.','3 hours','HIGH','High','Not Started','', true]);
  agentRow(r++, ['','Business Development','Clinical Trial Intelligence','Monitors relevant trials, identifies unmet needs, finds trial sponsors and partnership opportunities.','2 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Business Development','Licensing Opportunity Agent','Finds in-licensing and out-licensing opportunities. Tracks patent auctions and technology transfers.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Business Development','Conference ROI Analyzer','Recommends which conferences to attend/sponsor based on attendee analysis and partnership ROI.','1 hour','LOW','Low','Not Started','', false]);
  agentRow(r++, ['','Business Development','Market Intelligence','Tracks cancer drug market trends, competitor pipelines, M&A activity, and exit opportunities.','2 hours','MEDIUM','Medium','Not Started','', false]);

  // spacing
  r++;

  // COMMUNICATIONS & ADMIN
  addCategoryRow(r, '📧 COMMUNICATIONS & ADMIN', colors.pink); r++;
  agentRow(r++, ['','Communications','Email Prioritizer','Sorts 200+ daily emails into: urgent/review/delegate/ignore with smart summaries.','5 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Communications','Meeting Prep Agent','Prepares briefing docs for every meeting: attendee background, talking points, suggested outcomes.','3 hours','HIGH','Low','Not Started','', true]);
  agentRow(r++, ['','Communications','Board Report Generator','Compiles monthly board reports from research progress, financials, team updates automatically.','4 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Communications','Internal Announcements Writer','Drafts team communications: milestone celebrations, new hires, policy updates.','1 hour','LOW','Low','Not Started','', false]);
  agentRow(r++, ['','Communications','LinkedIn Content Generator','Creates LinkedIn posts highlighting research achievements, team milestones, thought leadership.','2 hours','MEDIUM','Low','Not Started','', false]);
  agentRow(r++, ['','Communications','Press Release Writer','Drafts press releases for significant research breakthroughs and company milestones.','2 hours','MEDIUM','Low','Not Started','', false]);

  // spacing
  r++;

  // FINANCIAL OPERATIONS
  addCategoryRow(r, '💰 FINANCIAL OPERATIONS', colors.yellow, colors.black); r++;
  agentRow(r++, ['','Financial','Budget Optimizer','Recommends resource reallocation based on research progress and ROI analysis.','2 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Financial','Burn Rate Monitor','Tracks spending velocity daily, alerts on budget risks, calculates runway.','1 hour','HIGH','Low','Not Started','', true]);
  agentRow(r++, ['','Financial','Research ROI Analyzer','Calculates cost per publication, grant success ROI, program efficiency. Investment recommendations.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Financial','Vendor Intelligence','Monitors equipment/service vendors for better pricing, tracks contract renewals, suggests alternatives.','1 hour','LOW','Low','Not Started','', false]);

  // spacing
  r++;

  // REGULATORY & COMPLIANCE
  addCategoryRow(r, '⚖️ REGULATORY & COMPLIANCE', colors.red); r++;
  agentRow(r++, ['','Regulatory','Regulatory Intelligence','Monitors FDA/regulatory changes affecting ACM research. Tracks approval trends and competitor approvals.','2 hours','MEDIUM','Medium','Not Started','', false]);
  agentRow(r++, ['','Regulatory','Risk Monitor','Flags compliance risks, research ethics issues, safety concerns, IP infringement risks.','1 hour','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Regulatory','Audit Preparation','Maintains audit-ready documentation, flags potential audit issues before they become problems.','1 hour','MEDIUM','Low','Not Started','', false]);

  // spacing
  r++;

  // PERSONAL PRODUCTIVITY
  addCategoryRow(r, '🧠 PERSONAL PRODUCTIVITY', colors.indigo); r++;
  agentRow(r++, ['','Personal','Decision Intelligence','Summarizes complex issues with pros/cons, risk assessment, data-driven recommendations.','3 hours','HIGH','High','Not Started','', true]);
  agentRow(r++, ['','Personal','Reading Digest Agent','Curates must-read papers, industry news, competitor updates into 10-minute daily digest.','5 hours','HIGH','Medium','Not Started','', true]);
  agentRow(r++, ['','Personal','Calendar Optimizer','Suggests meeting consolidation, blocks focus time, identifies unnecessary meetings.','2 hours','MEDIUM','Low','Not Started','', true]);
  agentRow(r++, ['','Personal','Travel Coordinator','Books travel, manages itineraries, prepares trip briefs with meeting schedules and local intel.','2 hours','LOW','Low','Not Started','', false]);

  const lastDataRow = r - 1;

  // === DATA VALIDATIONS ===
  // Priority (A): dropdown
  const priorityList = ['5 - Critical','4 - High','3 - Medium','2 - Low','1 - Not Now'];
  main.getRange(7,1,lastDataRow-6,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(priorityList, true).build()
  );

  // Business Impact (F): HIGH/MEDIUM/LOW
  const impactList = ['HIGH','MEDIUM','LOW'];
  main.getRange(7,6,lastDataRow-6,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(impactList, true).build()
  );

  // Build Complexity (G): Low/Medium/High
  const complexityList = ['Low','Medium','High'];
  main.getRange(7,7,lastDataRow-6,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(complexityList, true).build()
  );

  // Status (H): Not Started/Planning/In Progress/Complete
  const statusList = ['Not Started','Planning','In Progress','Complete'];
  main.getRange(7,8,lastDataRow-6,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(statusList, true).build()
  );

  // Quick Win? (J): Checkbox
  main.getRange(7,10,lastDataRow-6,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireCheckbox().build()
  );

  // === CONDITIONAL FORMATTING ===
  const rules = main.getConditionalFormatRules();

  // Priority colors (A)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('5')
    .setBackground(colors.red600).setFontColor(colors.white).setBold(true)
    .setRanges([main.getRange(7,1,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('4')
    .setBackground(colors.amber).setFontColor(colors.white).setBold(true)
    .setRanges([main.getRange(7,1,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('3')
    .setBackground(colors.blue500).setFontColor(colors.white)
    .setRanges([main.getRange(7,1,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('2')
    .setBackground(colors.green500).setFontColor(colors.white)
    .setRanges([main.getRange(7,1,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('1')
    .setBackground(colors.gray700).setFontColor(colors.white)
    .setRanges([main.getRange(7,1,lastDataRow-6,1)]).build());

  // Business Impact (F)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('HIGH')
    .setBackground(colors.green500).setFontColor(colors.white).setBold(true)
    .setRanges([main.getRange(7,6,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('MEDIUM')
    .setBackground(colors.amber).setFontColor(colors.black)
    .setRanges([main.getRange(7,6,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('LOW')
    .setBackground(colors.gray700).setFontColor(colors.white)
    .setRanges([main.getRange(7,6,lastDataRow-6,1)]).build());

  // Build Complexity (G)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Low')
    .setBackground(colors.green500).setFontColor(colors.white)
    .setRanges([main.getRange(7,7,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Medium')
    .setBackground(colors.amber).setFontColor(colors.black)
    .setRanges([main.getRange(7,7,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('High')
    .setBackground(colors.red).setFontColor(colors.white)
    .setRanges([main.getRange(7,7,lastDataRow-6,1)]).build());

  // Status (H)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Complete')
    .setBackground(colors.green500).setFontColor(colors.white).setBold(true)
    .setRanges([main.getRange(7,8,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('In Progress')
    .setBackground(colors.blue500).setFontColor(colors.white).setBold(true)
    .setRanges([main.getRange(7,8,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Planning')
    .setBackground(colors.amber).setFontColor(colors.black)
    .setRanges([main.getRange(7,8,lastDataRow-6,1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Not Started')
    .setBackground(colors.lightGray).setFontColor(colors.black)
    .setRanges([main.getRange(7,8,lastDataRow-6,1)]).build());

  main.setConditionalFormatRules(rules);

  // Fonts
  main.getRange('A1:J1').setFontFamily('Arial');
  main.getRange('A2:J2').setFontFamily('Arial');
  main.getRange('A4:J4').setFontFamily('Arial');
  main.getRange('A6:J' + lastDataRow).setFontFamily('Arial').setFontSize(10);
  main.getRange('A6:J6').setFontSize(11);

  // === SUMMARY DASHBOARD (L1:N20) ===
  main.insertColumnsAfter(10, 5); // ensure L:N exist
  const dash = main.getRange('L1:N20');
  dash.setFontFamily('Arial');

  main.getRange('L1:N1').merge().setValue('📊 SUMMARY DASHBOARD')
    .setBackground(colors.darkGray).setFontColor(colors.white).setFontSize(14).setFontWeight('bold')
    .setHorizontalAlignment('center');

  main.getRange('L3').setValue('Total Agents:');
  main.getRange('M3').setFormula('=COUNTA(C7:C'+lastDataRow+')');

  main.getRange('L5').setValue('Rated by You:');
  main.getRange('M5').setFormula('=COUNTA(A7:A'+lastDataRow+')');

  main.getRange('L6').setValue('Avg Priority:');
  main.getRange('M6').setFormula('=AVERAGE(A7:A'+lastDataRow+')');

  main.getRange('L8').setValue('TIME SAVINGS:');
  bold(main.getRange('L8'));
  main.getRange('L9').setValue('Quick Wins:');
  main.getRange('M9').setValue('25 hrs/week');
  main.getRange('L10').setValue('Total Possible:');
  main.getRange('M10').setValue('67 hrs/week');

  main.getRange('L12').setValue('COMPLEXITY:');
  bold(main.getRange('L12'));
  main.getRange('L13').setValue('Low:');
  main.getRange('M13').setFormula('=COUNTIF(G7:G'+lastDataRow+',"Low")');
  main.getRange('L14').setValue('Medium:');
  main.getRange('M14').setFormula('=COUNTIF(G7:G'+lastDataRow+',"Medium")');
  main.getRange('L15').setValue('High:');
  main.getRange('M15').setFormula('=COUNTIF(G7:G'+lastDataRow+',"High")');

  main.getRange('L17').setValue('TOP 5 PRIORITIES:');
  bold(main.getRange('L17'));
  main.getRange('L18').setValue('1.');
  main.getRange('M18').setFormula('=INDEX(C7:C'+lastDataRow+', MATCH(MAX(A7:A'+lastDataRow+'), A7:A'+lastDataRow+', 0))');
  // Simple examples for 2-5 (non-duplicate logic kept simple)
  main.getRange('L19').setValue('2.');
  main.getRange('M19').setFormula('=INDEX(C7:C'+lastDataRow+', MATCH(LARGE(A7:A'+lastDataRow+',2), A7:A'+lastDataRow+', 0))');
  main.getRange('L20').setValue('3.');
  main.getRange('M20').setFormula('=INDEX(C7:C'+lastDataRow+', MATCH(LARGE(A7:A'+lastDataRow+',3), A7:A'+lastDataRow+', 0))');

  // === QUICK WINS SHEET ===
  quick.getRange('A1:J1').merge().setValue('⚡ QUICK WIN AGENTS\nHigh Impact + Fast to Build')
    .setWrap(true)
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setBackground(colors.amber).setFontColor(colors.white).setFontWeight('bold').setFontSize(24);

  // headers row on Quick Wins
  quick.getRange('A3:J3').setValues([headers])
    .setFontWeight('bold').setBackground(colors.darkGray).setFontColor(colors.white)
    .setHorizontalAlignment('center');

  quick.setFrozenRows(3);
  widths.forEach((w, i) => quick.setColumnWidth(i+1, w));

  // Filter formula
  quick.getRange('A4').setFormula(`=FILTER('Agent Portfolio'!A7:J${lastDataRow}, 'Agent Portfolio'!J7:J${lastDataRow}=TRUE)`);

  // Copy basic conditional formats for priority/status columns (visual parity)
  // (Sheets doesn't let us directly copy rules; we’ll apply lightweight versions)
  const qRules = [
    // Priority col A
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('5')
      .setBackground(colors.red600).setFontColor(colors.white).setBold(true)
      .setRanges([quick.getRange('A4:A')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('4')
      .setBackground(colors.amber).setFontColor(colors.white).setBold(true)
      .setRanges([quick.getRange('A4:A')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('3')
      .setBackground(colors.blue500).setFontColor(colors.white)
      .setRanges([quick.getRange('A4:A')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('2')
      .setBackground(colors.green500).setFontColor(colors.white)
      .setRanges([quick.getRange('A4:A')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('1')
      .setBackground(colors.gray700).setFontColor(colors.white)
      .setRanges([quick.getRange('A4:A')]).build(),
    // Status col H
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Complete')
      .setBackground(colors.green500).setFontColor(colors.white).setBold(true)
      .setRanges([quick.getRange('H4:H')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('In Progress')
      .setBackground(colors.blue500).setFontColor(colors.white).setBold(true)
      .setRanges([quick.getRange('H4:H')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Planning')
      .setBackground(colors.amber).setFontColor(colors.black)
      .setRanges([quick.getRange('H4:H')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Not Started')
      .setBackground(colors.lightGray).setFontColor(colors.black)
      .setRanges([quick.getRange('H4:H')]).build(),
  ];
  quick.setConditionalFormatRules(qRules);
  quick.getRange('A1:J1').setRowHeight(72);
  quick.getRange('A3:J3').setFontSize(11);
  quick.getRange('A4:J1000').setFontFamily('Arial').setFontSize(10);

  // === BUILD ROADMAP SHEET ===
  roadmap.getRange('A1:I1').merge().setValue('🚀 AGENT BUILD ROADMAP')
    .setBackground(colors.purpleGrad).setFontColor(colors.white).setHorizontalAlignment('center')
    .setFontWeight('bold').setFontSize(24);

  const rHeaders = ['Phase','Agent Name','Priority Score','Time Saved','Build Time','Dependencies','Start Date','Launch Date','Owner'];
  roadmap.getRange('A3:I3').setValues([rHeaders]).setFontWeight('bold')
    .setBackground(colors.darkGray).setFontColor(colors.white);

  // Phase sections
  roadmap.getRange('A4:I4').merge().setValue('PHASE 1: FOUNDATIONS (Weeks 1-4)\nQuick wins with immediate impact')
    .setBackground(colors.blue).setFontColor(colors.white).setFontWeight('bold').setWrap(true);
  roadmap.getRange('A10:I10').merge().setValue('PHASE 2: INTELLIGENCE (Weeks 5-12)\nStrategic and analytical agents')
    .setBackground(colors.cyan).setFontColor(colors.white).setFontWeight('bold').setWrap(true);
  roadmap.getRange('A16:I16').merge().setValue('PHASE 3: AUTOMATION (Weeks 13-24)\nProcess optimization agents')
    .setBackground(colors.green).setFontColor(colors.white).setFontWeight('bold').setWrap(true);

  // Auto-populate Top 5 (rows 5-9) — uses Priority column in main
  // B5 (Agent Name highest rated)
  roadmap.getRange('B5').setFormula(`=INDEX(SORT(FILTER('Agent Portfolio'!C7:C${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FILTER('Agent Portfolio'!A7:A${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FALSE), 1)`);
  // Simple fill-down approach for next items (2-5) by k=2..5
  roadmap.getRange('B6').setFormula(`=INDEX(SORT(FILTER('Agent Portfolio'!C7:C${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FILTER('Agent Portfolio'!A7:A${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FALSE), 2)`);
  roadmap.getRange('B7').setFormula(`=INDEX(SORT(FILTER('Agent Portfolio'!C7:C${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FILTER('Agent Portfolio'!A7:A${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FALSE), 3)`);
  roadmap.getRange('B8').setFormula(`=INDEX(SORT(FILTER('Agent Portfolio'!C7:C${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FILTER('Agent Portfolio'!A7:A${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FALSE), 4)`);
  roadmap.getRange('B9').setFormula(`=INDEX(SORT(FILTER('Agent Portfolio'!C7:C${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FILTER('Agent Portfolio'!A7:A${lastDataRow}, 'Agent Portfolio'!A7:A${lastDataRow}<>""), FALSE), 5)`);

  // Column widths Roadmap
  const rWidths = [120,300,140,120,120,220,120,120,160];
  rWidths.forEach((w, i) => roadmap.setColumnWidth(i+1, w));
  roadmap.setFrozenRows(3);
  roadmap.getRange('A3:I30').setFontFamily('Arial').setFontSize(10);

  // === Page Setup & Protection Suggestions (visuals)
  // Landscape/narrow margins not available via Apps Script UI settings; optional for user via File > Print
  // Protect only specific ranges: leave A, I editable for notes and priority.
  // We'll leave protection to user preference.

  // === Nice: Center header row text vertical alignment across main headers
  main.getRange('A6:J6').setVerticalAlignment('middle');

  // Align key columns
  main.getRange('B7:B'+lastDataRow).setHorizontalAlignment('left');
  main.getRange('C7:C'+lastDataRow).setHorizontalAlignment('left');
  main.getRange('D7:D'+lastDataRow).setHorizontalAlignment('left');
  main.getRange('I7:I'+lastDataRow).setHorizontalAlignment('left');

  // Done
  ss.setActiveSheet(main);
}
