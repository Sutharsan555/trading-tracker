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

    // Net PnL (subtract fees)
    const netPnl = status === 'Closed' ? pnl - (parseFloat(formData.get('fees')) || 0) : 0;

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
        notes: formData.get('notes'),
        status,
        pnl: netPnl,
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
