/* ============================================
   Bridge - 共通JavaScript
   全ページで共有される動作
   ============================================ */

// ============ Reveal on scroll ============
// スクロールで要素をフェードイン表示
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => io.observe(r));
}

// ============ Header shadow on scroll ============
// スクロール時にヘッダーへ影を追加
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
    }
  });
}

// ============ Formspree 非同期送信 ============
// お問い合わせフォームがあるページのみ動作
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // action URLが未設定の場合の警告
    if (form.action.includes('YOUR_FORM_ID')) {
      statusEl.className = 'form-status error';
      statusEl.textContent = '⚠ FormspreeのフォームIDが未設定です。index.htmlのaction属性を編集してください。';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✓ お問い合わせを送信しました。担当者よりご連絡いたします。';
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = json.errors ? json.errors.map(err => err.message).join(', ') : '送信に失敗しました。時間をおいて再度お試しください。';
        statusEl.className = 'form-status error';
        statusEl.textContent = '✗ ' + msg;
      }
    } catch (err) {
      statusEl.className = 'form-status error';
      statusEl.textContent = '✗ ネットワークエラーが発生しました。再度お試しください。';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
    }
  });
}

// ============ 現在のページに応じてナビにactiveクラス付与 ============
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-list a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
