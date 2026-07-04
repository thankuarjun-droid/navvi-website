(function () {
  const LEAK_RATES = {
    rework: [1.1, 2.6],
    efficiency: [1.4, 3.2],
    delay: [0.9, 2.2],
    training: [0.7, 1.8],
    fabric: [1.2, 2.8],
    cash: [0.8, 2.0],
    visibility: [0.5, 1.3]
  };

  function formatCr(value) {
    return `₹${value.toFixed(1)} Cr`;
  }

  function wireCalculator() {
    const form = document.querySelector('[data-profit-calculator]');
    const output = document.querySelector('[data-calc-output]');
    const detail = document.querySelector('[data-calc-detail]');
    const whatsapp = document.querySelector('[data-calc-whatsapp]');
    const rftDisplay = document.querySelector('[data-rft-display]');
    const oweDisplay = document.querySelector('[data-owe-display]');
    if (!form || !output) return;

    const rftInput = form.querySelector('[name="rft"]');
    const oweInput = form.querySelector('[name="owe"]');

    const syncRanges = () => {
      if (rftDisplay && rftInput) rftDisplay.textContent = `${rftInput.value}%`;
      if (oweDisplay && oweInput) oweDisplay.textContent = `${oweInput.value}%`;
    };

    const calculate = () => {
      const turnover = Math.max(parseFloat(form.turnover.value) || 0, 1);
      const lines = Math.max(parseInt(form.lines.value, 10) || 1, 1);
      const rft = parseFloat(rftInput?.value || 88);
      const owe = parseFloat(oweInput?.value || 62);
      const leaks = [...form.querySelectorAll('[name="leak"]:checked')].map((el) => el.value);

      let lowPct = 0;
      let highPct = 0;

      leaks.forEach((leak) => {
        const range = LEAK_RATES[leak];
        if (!range) return;
        lowPct += range[0];
        highPct += range[1];
      });

      if (!leaks.length) {
        lowPct = 1.0;
        highPct = 2.5;
      }

      if (rft < 90) {
        lowPct += (90 - rft) * 0.04;
        highPct += (90 - rft) * 0.06;
      }

      if (owe < 70) {
        lowPct += (70 - owe) * 0.03;
        highPct += (70 - owe) * 0.05;
      }

      const scale = 1 + Math.min(lines / 40, 0.25);
      lowPct *= scale;
      highPct *= scale;

      const low = (turnover * lowPct) / 100;
      const high = (turnover * highPct) / 100;
      const cappedHigh = Math.min(high, turnover * 0.18);
      const cappedLow = Math.min(low, cappedHigh * 0.65);

      output.textContent = `${formatCr(cappedLow)} – ${formatCr(cappedHigh)} / year`;

      if (detail) {
        detail.textContent = `Based on ₹${turnover} Cr turnover, ${lines} lines, RFT ${rft}% and OWE ${owe}% across ${leaks.length || 'general'} leak area(s). Indicative only — confirmed in assessment.`;
      }

      if (whatsapp) {
        const text = `Hello Navvi, I used your profit leak estimator. Turnover: ₹${turnover} Cr, lines: ${lines}, RFT: ${rft}%, OWE: ${owe}%. Estimated range: ${formatCr(cappedLow)} to ${formatCr(cappedHigh)} per year. Please discuss my factory.`;
        whatsapp.href = `https://wa.me/919894466715?text=${encodeURIComponent(text)}`;
      }
    };

    syncRanges();
    calculate();

    form.addEventListener('input', () => {
      syncRanges();
      calculate();
    });

    form.querySelector('[data-calc-run]')?.addEventListener('click', calculate);
  }

  wireCalculator();
})();