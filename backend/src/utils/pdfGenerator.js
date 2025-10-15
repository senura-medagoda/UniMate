import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDFReport = async (reportData, reportType, period) => {
    console.log('Starting PDF generation for:', reportType, period);
    
    // Try html-pdf-node first (more reliable)
    try {
        console.log('Trying html-pdf-node method...');
        return await generatePDFWithHtmlPdfNode(reportData, reportType, period);
    } catch (htmlPdfError) {
        console.error('html-pdf-node failed:', htmlPdfError.message);
        console.log('Falling back to puppeteer method...');
        
        // Fallback to puppeteer
        try {
            return await generatePDFWithPuppeteer(reportData, reportType, period);
        } catch (puppeteerError) {
            console.error('Both PDF generation methods failed');
            console.error('html-pdf-node error:', htmlPdfError.message);
            console.error('puppeteer error:', puppeteerError.message);
            throw new Error(`PDF generation failed: ${puppeteerError.message}`);
        }
    }
};

const generatePDFWithHtmlPdfNode = async (reportData, reportType, period) => {
    const htmlPdf = await import('html-pdf-node');
    const htmlContent = generateSimpleHTMLContent(reportData, reportType, period);
    
    const options = {
        format: 'A4',
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        },
        printBackground: false,
        displayHeaderFooter: false
    };
    
    const file = { content: htmlContent };
    const pdfBuffer = await htmlPdf.default.generatePdf(file, options);
    
    console.log('PDF generated with html-pdf-node, size:', pdfBuffer.length);
    return pdfBuffer;
};

const generatePDFWithPuppeteer = async (reportData, reportType, period) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        
        const htmlContent = generateSimpleHTMLContent(reportData, reportType, period);
        
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        await page.waitForTimeout(3000);
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: false,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });
        
        console.log('PDF generated with puppeteer, size:', pdfBuffer.length);
        return pdfBuffer;
        
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }
    }
};

const generateSimpleHTMLContent = (reportData, reportType, period) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const periodText = getPeriodText(period);
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${reportData.title || 'Report'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #f97316;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .stats {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 20px 0;
        }
        .stat {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #f97316;
            min-width: 150px;
            text-align: center;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #f97316;
        }
        .stat-label {
            color: #666;
            font-size: 12px;
        }
        .section {
            margin: 25px 0;
        }
        .section h2 {
            color: #333;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f97316;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportData.title || 'Report'}</h1>
        <p>Period: ${periodText}</p>
        <p>Generated on: ${currentDate}</p>
    </div>
    
    <div class="section">
        <h2>Platform Overview</h2>
        <div class="stats">
            <div class="stat">
                <div class="stat-value">${reportData.summary?.totalJobs || 0}</div>
                <div class="stat-label">Total Jobs</div>
            </div>
            <div class="stat">
                <div class="stat-value">${reportData.summary?.totalManagers || 0}</div>
                <div class="stat-label">Total Managers</div>
            </div>
            <div class="stat">
                <div class="stat-value">${reportData.summary?.totalApplications || 0}</div>
                <div class="stat-label">Total Applications</div>
            </div>
            <div class="stat">
                <div class="stat-value">${reportData.summary?.liveJobs || 0}</div>
                <div class="stat-label">Live Jobs</div>
            </div>
            <div class="stat">
                <div class="stat-value">${reportData.summary?.verifiedManagers || 0}</div>
                <div class="stat-label">Verified Managers</div>
            </div>
            <div class="stat">
                <div class="stat-value">${reportData.summary?.hiredApplications || 0}</div>
                <div class="stat-label">Hired Applications</div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Generated by UniMate Job Portal Admin System</p>
        <p>This report contains confidential information and should be handled appropriately.</p>
    </div>
</body>
</html>`;
};

const generateHTMLContent = (reportData, reportType, period) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const periodText = getPeriodText(period);
    
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.title || 'Report'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #f97316;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header p {
            color: #666;
            margin: 5px 0;
            font-size: 14px;
        }
        .stats-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #f97316;
            text-align: center;
            min-width: 150px;
            flex: 1;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #f97316;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #666;
            font-size: 12px;
        }
        .section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #333;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background-color: #f97316;
            color: white;
            font-weight: bold;
        }
        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportData.title || 'Report'}</h1>
        <p>Period: ${periodText}</p>
        <p>Generated on: ${currentDate}</p>
    </div>`;
    
    // Add content based on report type
    switch (reportType) {
        case 'overview':
            content += generateOverviewContent(reportData);
            break;
        case 'jobs':
            content += generateJobsContent(reportData);
            break;
        case 'managers':
            content += generateManagersContent(reportData);
            break;
        case 'applications':
            content += generateApplicationsContent(reportData);
            break;
        default:
            content += generateOverviewContent(reportData);
    }
    
    content += `
        <div class="footer">
            <p>Generated by UniMate Job Portal Admin System</p>
            <p>This report contains confidential information and should be handled appropriately.</p>
        </div>
    </body>
    </html>
    `;
    
    return content;
};

const generateOverviewContent = (reportData) => {
    return `
        <div class="section">
            <h2>Platform Overview</h2>
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.totalJobs || 0}</div>
                    <div class="stat-label">Total Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.totalManagers || 0}</div>
                    <div class="stat-label">Total Managers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.totalApplications || 0}</div>
                    <div class="stat-label">Total Applications</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.liveJobs || 0}</div>
                    <div class="stat-label">Live Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.verifiedManagers || 0}</div>
                    <div class="stat-label">Verified Managers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.summary?.hiredApplications || 0}</div>
                    <div class="stat-label">Hired Applications</div>
                </div>
            </div>
        </div>
    `;
};

const generateJobsContent = (reportData) => {
    let jobsTable = '';
    if (reportData.jobs && reportData.jobs.length > 0) {
        jobsTable = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Posted Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.jobs.slice(0, 20).map(job => `
                        <tr>
                            <td>${job.title || 'N/A'}</td>
                            <td>${job.company || 'N/A'}</td>
                            <td>${job.status || 'N/A'}</td>
                            <td>${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    return `
        <div class="section">
            <h2>Job Analytics</h2>
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.total || 0}</div>
                    <div class="stat-label">Total Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.live || 0}</div>
                    <div class="stat-label">Live Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.pending || 0}</div>
                    <div class="stat-label">Pending Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.rejected || 0}</div>
                    <div class="stat-label">Rejected Jobs</div>
                </div>
            </div>
            ${jobsTable}
        </div>
    `;
};

const generateManagersContent = (reportData) => {
    let managersTable = '';
    if (reportData.managers && reportData.managers.length > 0) {
        managersTable = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.managers.slice(0, 20).map(manager => `
                        <tr>
                            <td>${(manager.hm_fname || '')} ${(manager.hm_lname || '')}</td>
                            <td>${manager.hm_company || 'N/A'}</td>
                            <td>${manager.hm_status || 'N/A'}</td>
                            <td>${manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    return `
        <div class="section">
            <h2>Manager Activity</h2>
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.total || 0}</div>
                    <div class="stat-label">Total Managers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.verified || 0}</div>
                    <div class="stat-label">Verified</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.unverified || 0}</div>
                    <div class="stat-label">Unverified</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.rejected || 0}</div>
                    <div class="stat-label">Rejected</div>
                </div>
            </div>
            ${managersTable}
        </div>
    `;
};

const generateApplicationsContent = (reportData) => {
    let applicationsTable = '';
    if (reportData.applications && reportData.applications.length > 0) {
        applicationsTable = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Job Title</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.applications.slice(0, 20).map(app => `
                        <tr>
                            <td>${app.studentName || 'N/A'}</td>
                            <td>${app.jobId?.title || 'N/A'}</td>
                            <td>${app.status || 'N/A'}</td>
                            <td>${app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    return `
        <div class="section">
            <h2>Application Trends</h2>
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.total || 0}</div>
                    <div class="stat-label">Total Applications</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.pending || 0}</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.shortlisted || 0}</div>
                    <div class="stat-label">Shortlisted</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.hired || 0}</div>
                    <div class="stat-label">Hired</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.stats?.rejected || 0}</div>
                    <div class="stat-label">Rejected</div>
                </div>
            </div>
            ${applicationsTable}
        </div>
    `;
};

const getPeriodText = (period) => {
    switch (period) {
        case '7days': return 'Last 7 days';
        case '30days': return 'Last 30 days';
        case '90days': return 'Last 90 days';
        case '1year': return 'Last year';
        default: return 'Last 30 days';
    }
};
