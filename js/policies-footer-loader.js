// 统一的 Footer 加载脚本
document.addEventListener('DOMContentLoaded', function() {
    const footerElement = document.getElementById('footer');

    if (footerElement) {
        // 尝试从本地加载 footer
        fetch('../policies-footer-content.html')
            .then(response => response.text())
            .then(html => {
                footerElement.innerHTML = html;
            })
            .catch(error => {
                console.error('本地 Footer 加载失败:', error);
                // 如果本地加载失败，尝试从 GitHub 仓库加载
                fetch('https://kyouteki461-star.github.io/forestsoft-homepage/footer-content.html')
                    .then(response => {
                        if (!response.ok) throw new Error('CDN 加载失败');
                        return response.text();
                    })
                    .then(html => {
                        footerElement.innerHTML = html;
                    })
                    .catch(error => {
                        console.error('CDN Footer 加载也失败:', error);
                        // 如果都失败了，显示一个简单的 footer
                        footerElement.innerHTML = `
                            <footer class="footer">
                                <div class="footer-bottom">
                                    <p>Copyright(c) 2019-2026 ForestSoft Co., Ltd. All Rights Reserved.</p>
                                </div>
                            </footer>
                        `;
                    });
            });
    }
});