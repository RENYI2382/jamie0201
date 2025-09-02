document.addEventListener('DOMContentLoaded', function() {
    // 设置最后更新日期
    const lastUpdate = document.getElementById('last-update');
    const currentDate = new Date();
    lastUpdate.textContent = currentDate.toLocaleDateString('zh-CN');
    
    // 添加页面加载动画
    document.body.classList.add('loaded');
    
    // 导航栏响应式切换
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
    
    burger.addEventListener('click', () => {
        // 切换导航菜单
        nav.classList.toggle('nav-active');
        
        // 显示/隐藏遮罩层
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // 导航链接动画
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // 汉堡按钮动画
        burger.classList.toggle('toggle');
    });
    
    // 点击遮罩层关闭导航
    overlay.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        burger.classList.remove('toggle');
        
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 如果在移动设备上，点击后关闭导航菜单
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    
                    navLinks.forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });
    
    // 技能进度条动画
    const skillLevels = document.querySelectorAll('.skill-level');
    const sections = document.querySelectorAll('.section');
    
    // 检查元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // 初始化技能进度条
    function initSkillBars() {
        skillLevels.forEach(skill => {
            if (isInViewport(skill.parentElement.parentElement)) {
                const level = skill.getAttribute('data-level');
                skill.style.width = level + '%';
                
                // 添加数值显示
                const skillName = skill.parentElement.previousElementSibling;
                if (!skillName.querySelector('.skill-percentage')) {
                    const percentage = document.createElement('span');
                    percentage.classList.add('skill-percentage');
                    percentage.textContent = level + '%';
                    skillName.appendChild(percentage);
                    
                    // 添加数值动画
                    setTimeout(() => {
                        percentage.classList.add('show');
                    }, 500);
                }
            }
        });
    }
    
    // 添加滚动动画
    function handleScroll() {
        // 处理技能进度条
        initSkillBars();
        
        // 处理各部分的滚动动画
        sections.forEach(section => {
            if (isInViewport(section) && !section.classList.contains('animated')) {
                section.classList.add('animated');
            }
        });
    }
    
    // 页面滚动时检查元素是否在视口中
    window.addEventListener('scroll', handleScroll);
    
    // 页面加载时初始化
    setTimeout(handleScroll, 300);
    
    // 打印简历功能
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
    
    // 下载PDF功能
    document.getElementById('download-btn').addEventListener('click', function() {
        // 创建一个新的jsPDF实例
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // 获取简历内容
        const resumeContent = document.querySelector('.container');
        
        // 使用html2canvas将HTML转换为canvas
        html2canvas(resumeContent, {
            scale: 1,
            useCORS: true,
            logging: false,
            allowTaint: true
        }).then(canvas => {
            // 将canvas转换为图像
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // 计算PDF页面尺寸
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            
            // 添加多个页面以适应整个简历
            let heightLeft = imgHeight;
            let position = 0;
            let page = 1;
            
            // 添加第一页
            doc.addImage(imgData, 'JPEG', imgX, position, imgWidth * ratio, imgHeight * ratio);
            heightLeft -= pdfHeight;
            
            // 如果内容超过一页，添加更多页面
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', imgX, position, imgWidth * ratio, imgHeight * ratio);
                heightLeft -= pdfHeight;
                page++;
            }
            
            // 保存PDF
            doc.save('任毅_个人简历.pdf');
        });
    });
    
    // 添加汉堡按钮动画样式
    const style = document.createElement('style');
    style.textContent = `
        .toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .toggle .line2 {
            opacity: 0;
        }
        .toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
});