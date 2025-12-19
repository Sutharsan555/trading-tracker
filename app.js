// State Management
let trades = JSON.parse(localStorage.getItem('trades')) || [];
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let pnlChartInstance = null;
let winLossChartInstance = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    renderTradeList();
    renderTodoList();

    // Set default date in modal and month pickers
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.querySelector('input[name="date"]').value = now.toISOString().slice(0, 16);

    const currentMonth = new Date().toISOString().slice(0, 7);
    document.getElementById('report-month').value = currentMonth;
    document.getElementById('calendar-month-picker').value = currentMonth;
});

// Navigation
function switchView(viewId) {
    // Update Sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${viewId}"]`).classList.add('active');

    // Update Main Content
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');

    if (viewId === 'dashboard') updateDashboard();
    if (viewId === 'trades') renderTradeList();
    if (viewId === 'calendar') renderCalendar();
}

// Modal Logic
function openModal() {
    document.getElementById('tradeModal').classList.add('active');
}

function closeModal() {
    document.getElementById('tradeModal').classList.remove('active');
}

document.getElementById('tradeModal').addEventListener('click', (e) => {
    if (e.target.id === 'tradeModal') closeModal();
});

// To-Do List Logic
function renderTodoList() {
    const list = document.getElementById('todo-list');
    if (!list) return;

    list.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span>${todo.text}</span>
            <i class="ph ph-trash todo-delete" onclick="deleteTodo(${todo.id})"></i>
        </div>
    `).join('');
}

function addTodoPrompt() {
    const text = prompt("Enter a new task:");
    if (text) {
        todos.push({ id: Date.now(), text, completed: false });
        saveTodos();
        renderTodoList();
    }
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodoList();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodoList();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


// Trade Logic
function handleTradeSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entryPrice = parseFloat(formData.get('entryPrice'));
    const exitPrice = parseFloat(formData.get('exitPrice')) || 0;
    const qty = parseFloat(formData.get('qty'));
    const type = formData.get('type');

    let pnl = 0;
    let pips = 0;
    let status = 'Open';

    // Check Manual P&L
    const manualPnL = formData.get('manualPnL');
    if (manualPnL && manualPnL.trim() !== '') {
        pnl = parseFloat(manualPnL);
        status = 'Closed';
    } else if (exitPrice > 0) {
        status = 'Closed';
        const isLong = type === 'Long';

        // P&L
        if (isLong) {
            pnl = (exitPrice - entryPrice) * qty;
        } else {
            pnl = (entryPrice - exitPrice) * qty;
        }

        // Pips (Forex Only)
        if (formData.get('market') === 'Forex') {
            const sym = formData.get('symbol').toUpperCase();
            const isJpy = sym.includes('JPY');
            const multiplier = isJpy ? 100 : 10000;

            pips = isLong
                ? (exitPrice - entryPrice) * multiplier
                : (entryPrice - exitPrice) * multiplier;

            pips = Math.round(pips * 10) / 10; // Round to 1 decimal
        }
    }

    // Auto-calculate investment if missing
    let investment = parseFloat(formData.get('investment'));
    const leverage = parseFloat(formData.get('leverage')) || 1;

    if (!investment && entryPrice > 0 && qty > 0) {
        if (formData.get('market') === 'Forex') {
            // Forex Margin = (Contract Size * Lots * Price) / Leverage
            // Assuming Qty is Units (Standard 1 Lot = 100,000)
            const sym = formData.get('symbol').toUpperCase();

            // Simple Logic: If Base is USD (USDJPY), Value = Qty. If Quote is USD (EURUSD), Value = Qty * Price.
            // Simplified: Use Qty * Price for everything as a safe conservative estimate or standard approach.
            // Actually, for USDJPY, Margin is 100,000 / Leverage (in USD). 
            // For EURUSD, Margin is 100,000 * 1.10 / Leverage (in USD).

            if (sym.startsWith('USD')) {
                investment = qty / leverage;
            } else {
                investment = (qty * entryPrice) / leverage;
            }
        } else {
            // Stock/Crypto: (Price * Qty) / Leverage
            investment = (entryPrice * qty) / leverage;
        }
    }

    // Net PnL (already subtracted fees)
    const netPnl = status === 'Closed' ? pnl - (parseFloat(formData.get('fees')) || 0) : 0;

    // Calculate ROI
    let roi = 0;
    if (status === 'Closed' && investment > 0) {
        roi = (netPnl / investment) * 100;
    }

    const trade = {
        id: Date.now(),
        date: formData.get('date'),
        market: formData.get('market'),
        symbol: formData.get('symbol').toUpperCase(),
        style: formData.get('style'),
        type,
        qty,
        entryPrice,
        exitPrice,
        fees: parseFloat(formData.get('fees')) || 0,
        leverage,
        investment,
        notes: formData.get('notes'),
        status,
        pnl: netPnl,
        roi: roi.toFixed(2),
        pips
    };

    trades.unshift(trade);
    saveTrades();
    closeModal();
    e.target.reset();

    // Refresh current view
    updateDashboard();
    renderTradeList();
    if (document.getElementById('view-calendar').classList.contains('active')) renderCalendar();
}

function deleteTrade(id) {
    if (confirm('Are you sure you want to delete this trade?')) {
        trades = trades.filter(t => t.id !== id);
        saveTrades();
        renderTradeList();
        updateDashboard();
        if (document.getElementById('view-calendar').classList.contains('active')) renderCalendar();
    }
}

function saveTrades() {
    localStorage.setItem('trades', JSON.stringify(trades));
}

// Dashboard Logic
function updateDashboard() {
    const closedTrades = trades.filter(t => t.status === 'Closed');

    // KPI Calculations
    const totalPnL = closedTrades.reduce((acc, t) => acc + t.pnl, 0);
    const wins = closedTrades.filter(t => t.pnl > 0).length;
    const losses = closedTrades.filter(t => t.pnl <= 0).length; // Break-even counts as no-win
    const winRate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : 0;

    const grossProfit = closedTrades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(closedTrades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
    const profitFactor = grossLoss === 0 ? grossProfit.toFixed(2) : (grossProfit / grossLoss).toFixed(2);

    // Update DOM
    document.getElementById('kpi-pnl').textContent = formatCurrency(totalPnL);
    document.getElementById('kpi-pnl').className = `stat-value ${totalPnL >= 0 ? 'stat-positive' : 'stat-negative'}`;

    document.getElementById('kpi-winrate').textContent = `${winRate}%`;
    document.getElementById('kpi-pf').textContent = profitFactor;
    document.getElementById('kpi-trades').textContent = closedTrades.length;

    // Charts
    updateCharts(closedTrades);
    renderRecentTrades();
}

function renderRecentTrades() {
    const tbody = document.getElementById('recent-trades-body');
    if (tbody) {
        tbody.innerHTML = trades.slice(0, 5).map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td><span class="badge badge-market ${t.market ? t.market.toLowerCase() : ''}">${t.market || 'Stock'}</span></td>
                <td><span style="font-weight:600">${t.symbol}</span></td>
                <td><span style="font-size:0.8rem; color:var(--text-muted)">${t.style || '-'}</span></td>
                <td><span class="badge ${t.type === 'Long' ? 'badge-long' : 'badge-short'}">${t.type}</span></td>
                <td><span class="${t.roi > 0 ? 'text-success' : (t.roi < 0 ? 'text-danger' : '')}">${t.roi ? t.roi + '%' : '-'}</span></td>
                <td>${t.status === 'Closed' ? (t.pnl >= 0 ? '<span class="badge badge-win">WIN</span>' : '<span class="badge badge-loss">LOSS</span>') : '<span style="color:var(--text-muted)">OPEN</span>'}</td>
                <td class="${t.pnl >= 0 ? 'stat-positive' : 'stat-negative'}">
                    ${t.status === 'Closed' ? formatCurrency(t.pnl) : '-'}
                    ${t.pips ? `<div style="font-size:0.75rem; opacity:0.8">${t.pips > 0 ? '+' : ''}${t.pips} pips</div>` : ''}
                </td>
            </tr>
        `).join('');
    }
}

function renderTradeList() {
    const tbody = document.getElementById('all-trades-body');
    if (!tbody) return;

    tbody.innerHTML = trades.map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleString()}</td>
            <td><span class="badge badge-market ${t.market ? t.market.toLowerCase() : ''}">${t.market || 'Stock'}</span></td>
            <td>${t.symbol}</td>
            <td>${t.style || '-'}</td>
            <td><span class="badge ${t.type === 'Long' ? 'badge-long' : 'badge-short'}">${t.type}</span></td>
            <td>${t.roi ? t.roi + '%' : '-'}</td>
            <td>${t.entryPrice}</td>
            <td>${t.exitPrice || '-'}</td>
            <td>${t.qty}</td>
            <td class="${t.pnl >= 0 ? 'stat-positive' : 'stat-negative'}">
                ${t.status === 'Closed' ? formatCurrency(t.pnl) : '-'}
                ${t.market === 'Forex' && t.pips ? `<span style="font-size:0.8rem; margin-left:4px; opacity:0.7">(${t.pips > 0 ? '+' : ''}${t.pips} pips)</span>` : ''}
            </td>
            <td>${t.status}</td>
            <td>
                <button onclick="deleteTrade(${t.id})" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem;">
                    <i class="ph ph-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Chart.js Setup
function updateCharts(closedTrades) {
    const ctxPnl = document.getElementById('pnlChart').getContext('2d');
    const ctxWinLoss = document.getElementById('winLossChart').getContext('2d');

    // Prepare Data: Sort by date ascending to show cumulative
    const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedTrades.map(t => new Date(t.date).toLocaleDateString());

    // Cumulative PnL
    let runningTotal = 0;
    const dataPoints = sortedTrades.map(t => {
        runningTotal += t.pnl;
        return runningTotal;
    });

    if (pnlChartInstance) pnlChartInstance.destroy();

    pnlChartInstance = new Chart(ctxPnl, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative P&L',
                data: dataPoints,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Equity Curve', color: '#9ca3af', align: 'start' }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { display: false }
            }
        }
    });

    // Win/Loss Donut
    const wins = closedTrades.filter(t => t.pnl > 0).length;
    const losses = closedTrades.filter(t => t.pnl <= 0).length;

    if (winLossChartInstance) winLossChartInstance.destroy();

    winLossChartInstance = new Chart(ctxWinLoss, {
        type: 'doughnut',
        data: {
            labels: ['Wins', 'Losses'],
            datasets: [{
                data: [wins, losses],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9ca3af' } },
                title: { display: true, text: 'Win Ratio', color: '#9ca3af' }
            },
            cutout: '70%'
        }
    });
}

// Calendar Logic
function renderCalendar() {
    const monthInput = document.getElementById('calendar-month-picker').value;
    if (!monthInput) return;

    const [year, month] = monthInput.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 is Sunday

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = ''; // clear

    // daily PnLs
    const dailyPnL = {};
    trades.forEach(t => {
        if (t.status === 'Closed') {
            const d = new Date(t.date);
            const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
            if (!dailyPnL[key]) dailyPnL[key] = 0;
            dailyPnL[key] += t.pnl;
        }
    });

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day empty';
        grid.appendChild(div);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const pnl = dailyPnL[dayStr];

        const cell = document.createElement('div');
        cell.className = 'calendar-day';

        let pnlHtml = '';
        if (pnl !== undefined) {
            const isPos = pnl >= 0;
            cell.classList.add(isPos ? 'day-positive' : 'day-negative');
            pnlHtml = `<div class="day-pnl">${formatCurrency(pnl)}</div>`;
        }

        cell.innerHTML = `
            <div class="day-number">${d}</div>
            ${pnlHtml}
        `;
        grid.appendChild(cell);
    }
}


// Reports Logic
// Report Type Handler
function handleReportTypeChange() {
    const reportType = document.getElementById('report-type').value;

    // Hide all date selectors
    document.getElementById('date-selector-daily').style.display = 'none';
    document.getElementById('date-selector-weekly').style.display = 'none';
    document.getElementById('date-selector-monthly').style.display = 'none';

    // Show the appropriate selector
    if (reportType === 'daily') {
        document.getElementById('date-selector-daily').style.display = 'block';
        document.getElementById('report-period-label').textContent = 'Day P&L';
    } else if (reportType === 'weekly') {
        document.getElementById('date-selector-weekly').style.display = 'block';
        document.getElementById('report-period-label').textContent = 'Week P&L';
    } else {
        document.getElementById('date-selector-monthly').style.display = 'block';
        document.getElementById('report-period-label').textContent = 'Month P&L';
    }

    // Hide report content until a date is selected
    document.getElementById('report-content').style.display = 'none';
}

function renderReport() {
    const reportType = document.getElementById('report-type').value;

    if (reportType === 'daily') {
        renderDailyReport();
    } else if (reportType === 'weekly') {
        renderWeeklyReport();
    } else {
        renderMonthlyReport();
    }
}

function renderDailyReport() {
    const dateInput = document.getElementById('report-date').value;
    if (!dateInput) return;

    const reportContent = document.getElementById('report-content');
    reportContent.style.display = 'block';

    const dayTrades = trades.filter(t => {
        return t.date === dateInput && t.status === 'Closed';
    });

    renderReportStats(dayTrades);
}

function renderWeeklyReport() {
    const weekInput = document.getElementById('report-week').value;
    if (!weekInput) return;

    const reportContent = document.getElementById('report-content');
    reportContent.style.display = 'block';

    // Parse week input (format: YYYY-Www)
    const [year, week] = weekInput.split('-W');

    // Get start and end dates of the week
    const startDate = getDateOfISOWeek(parseInt(week), parseInt(year));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const weekTrades = trades.filter(t => {
        const tradeDate = new Date(t.date);
        return tradeDate >= startDate && tradeDate <= endDate && t.status === 'Closed';
    });

    renderReportStats(weekTrades);
}

function renderMonthlyReport() {
    const monthInput = document.getElementById('report-month').value;
    if (!monthInput) return;

    const [year, month] = monthInput.split('-');
    const reportContent = document.getElementById('report-content');
    reportContent.style.display = 'block';

    const monthTrades = trades.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() == year && (d.getMonth() + 1) == month && t.status === 'Closed';
    });

    renderReportStats(monthTrades);
}

function renderReportStats(filteredTrades) {
    const totalPnL = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
    const wins = filteredTrades.filter(t => t.pnl > 0).length;
    const winRate = filteredTrades.length > 0 ? ((wins / filteredTrades.length) * 100).toFixed(1) : 0;

    document.getElementById('report-pnl').textContent = formatCurrency(totalPnL);
    document.getElementById('report-pnl').className = `stat-value ${totalPnL >= 0 ? 'stat-positive' : 'stat-negative'}`;
    document.getElementById('report-winrate').textContent = `${winRate}%`;
    document.getElementById('report-trades').textContent = filteredTrades.length;

    const tbody = document.getElementById('report-table-body');
    tbody.innerHTML = filteredTrades.map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.market || 'Stock'}</td>
            <td>${t.symbol}</td>
            <td>${t.style || '-'}</td>
            <td>${t.type}</td>
            <td class="${t.pnl >= 0 ? 'stat-positive' : 'stat-negative'}">
                ${formatCurrency(t.pnl)}
                ${t.market === 'Forex' && t.pips ? `<div style="font-size:0.75rem">${t.pips > 0 ? '+' : ''}${t.pips} pips</div>` : ''}
            </td>
            <td style="color:var(--text-muted); font-size:0.85rem">${t.notes || ''}</td>
        </tr>
    `).join('');
}

// Helper function to get the start date of an ISO week
function getDateOfISOWeek(week, year) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

// PDF Export
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const reportType = document.getElementById('report-type').value;

    let title = '';
    let filename = '';
    let dateInput = '';

    // Get the appropriate date input and generate title/filename
    if (reportType === 'daily') {
        dateInput = document.getElementById('report-date').value;
        if (!dateInput) {
            alert('Please select a date first.');
            return;
        }
        const date = new Date(dateInput);
        const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        title = `Daily Trade Review: ${dateStr}`;
        filename = `Trade_Review_Daily_${dateInput}.pdf`;
    } else if (reportType === 'weekly') {
        dateInput = document.getElementById('report-week').value;
        if (!dateInput) {
            alert('Please select a week first.');
            return;
        }
        const [year, week] = dateInput.split('-W');
        const startDate = getDateOfISOWeek(parseInt(week), parseInt(year));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        const weekStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        title = `Weekly Trade Review: Week ${week}, ${year}`;
        filename = `Trade_Review_Weekly_${year}_W${week}.pdf`;
    } else {
        dateInput = document.getElementById('report-month').value;
        if (!dateInput) {
            alert('Please select a month first.');
            return;
        }
        const [year, month] = dateInput.split('-');
        const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        title = `Monthly Trade Review: ${monthName} ${year}`;
        filename = `Trade_Review_${monthName}_${year}.pdf`;
    }

    // Title
    doc.setFontSize(22);
    doc.text(title, 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary Stats
    const pnl = document.getElementById('report-pnl').textContent;
    const winrate = document.getElementById('report-winrate').textContent;
    const count = document.getElementById('report-trades').textContent;

    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 180, 25, 'F');

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Net P&L: ${pnl}`, 20, 50);
    doc.text(`Win Rate: ${winrate}`, 90, 50);
    doc.text(`Trades: ${count}`, 150, 50);

    // Table
    const tableRows = [];
    const tbody = document.getElementById('report-table-body');
    tbody.querySelectorAll('tr').forEach(tr => {
        const rowData = [];
        tr.querySelectorAll('td').forEach(td => rowData.push(td.innerText));
        tableRows.push(rowData);
    });

    doc.autoTable({
        head: [['Date', 'Market', 'Symbol', 'Style', 'Type', 'P&L', 'Notes']],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] }, // Primary color
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(filename);
}

// Utility
function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}
