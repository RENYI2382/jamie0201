/**
 * 简历网页交互脚本
 * 实现导航、动画效果、PDF导出等功能
 */

// 常量定义
const SELECTORS = {
  sections: '.section',
  cards: '.card, .volunteer-item, .campus-item, .certificate-item',
  skillLevels: '.skill-level',
  navLinks: '.nav-links li',
  anchors: 'a[href^="#"]'
};

// 工具函数
const utils = {
  /**
   * 防抖函数 - 优化频繁触发的事件
   * @param {Function} func 要执行的函数
   * @param {number} wait 等待时间(ms)
   * @return {Function} 防抖处理后的函数
   */
  debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },
  
  /**
   * 检查元素是否在视口中
   * @param {Element} element 要检查的元素
   * @return {boolean} 是否在视口中
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  },
  
  /**
   * 生成随机数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @return {number} 随机数
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // 模块初始化
  initBasics();
  initNavigation();
  initAnimations();
  initScrollEffects();
  initPdfExport();
  initBackgroundEffects();
});

/**
 * 基础功能初始化
 */
function initBasics() {
  // 设置最后更新日期
  const lastUpdate = document.getElementById('last-update');
  if (lastUpdate) {
    const currentDate = new Date();
    lastUpdate.textContent = currentDate.toLocaleDateString('zh-CN');
  }
  
  // 添加页面加载动画
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
  
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
}

/**
 * 导航功能初始化
 */
function initNavigation() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll(SELECTORS.navLinks);
  
  // 创建导航遮罩层
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);
  
  // 汉堡菜单点击事件
  if (burger && nav) {
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
  }
  
  // 点击遮罩层关闭导航
  overlay.addEventListener('click', () => {
    if (nav && nav.classList.contains('nav-active')) {
      nav.classList.remove('nav-active');
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      if (burger) {
        burger.classList.remove('toggle');
      }
      
      navLinks.forEach(link => {
        link.style.animation = '';
      });
    }
  });
  
  // 平滑滚动到锚点
  document.querySelectorAll(SELECTORS.anchors).forEach(anchor => {
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
        if (nav && nav.classList.contains('nav-active')) {
          nav.classList.remove('nav-active');
          overlay.classList.remove('active');
          document.body.classList.remove('no-scroll');
          
          if (burger) {
            burger.classList.remove('toggle');
          }
          
          navLinks.forEach(link => {
            link.style.animation = '';
          });
        }
      }
    });
  });
}

/**
 * 鼠标交互动画初始化
 */
function initAnimations() {
  const sections = document.querySelectorAll(SELECTORS.sections);
  
  // 添加鼠标跟踪效果
  sections.forEach(section => {
    section.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 计算相对位置 (-1 到 1 的范围)
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;
      
      // 添加微妙的倾斜效果
      this.style.transform = `perspective(1000px) rotateX(${yPercent * -1}deg) rotateY(${xPercent * 1}deg) scale3d(1, 1, 1)`;
    });
    
    section.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

/**
 * 滚动效果初始化
 */
function initScrollEffects() {
  const sections = document.querySelectorAll(SELECTORS.sections);
  const skillLevels = document.querySelectorAll(SELECTORS.skillLevels);
  
  // 初始化技能进度条
  function initSkillBars() {
    skillLevels.forEach(skill => {
      if (utils.isInViewport(skill.parentElement.parentElement)) {
        const level = skill.getAttribute('data-level');
        skill.style.width = level + '%';
        
        // 添加数值显示
        const skillName = skill.parentElement.previousElementSibling;
        if (skillName && !skillName.querySelector('.skill-percentage')) {
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
  
  // 处理滚动动画
  function handleScroll() {
    // 处理技能进度条
    initSkillBars();
    
    // 处理各部分的滚动动画
    sections.forEach((section, index) => {
      if (utils.isInViewport(section) && !section.classList.contains('animated')) {
        // 添加延迟动画效果，使各部分依次显示
        setTimeout(() => {
          section.classList.add('animated');
        }, index * 100);
      }
    });
    
    // 添加卡片和项目的交错动画
    const cards = document.querySelectorAll(SELECTORS.cards);
    cards.forEach((card, index) => {
      if (utils.isInViewport(card) && !card.classList.contains('item-animated')) {
        setTimeout(() => {
          card.classList.add('item-animated');
        }, index * 80);
      }
    });
  }
  
  // 使用 IntersectionObserver API (如果浏览器支持)
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.classList.contains('item-animated')) {
          setTimeout(() => {
            entry.target.classList.add('item-animated');
          }, index * 80);
        }
      });
    }, { threshold: 0.1 });
    
    // 观察所有部分
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    
    // 观察所有卡片
    document.querySelectorAll(SELECTORS.cards).forEach(card => {
      cardObserver.observe(card);
    });
    
    // 仍然需要滚动处理技能进度条
    window.addEventListener('scroll', utils.debounce(() => {
      initSkillBars();
    }, 50));
  } else {
    // 回退到传统的滚动事件监听
    window.addEventListener('scroll', utils.debounce(handleScroll, 50));
  }
  
  // 页面加载时初始化
  setTimeout(handleScroll, 300);
}

/**
 * PDF导出功能初始化
 */
function initPdfExport() {
  // 打印简历功能
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }
  
  // 下载PDF功能
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      try {
        // 创建一个新的jsPDF实例
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
          throw new Error('jsPDF 库未正确加载');
        }
        
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // 获取简历内容
        const resumeContent = document.querySelector('.container');
        if (!resumeContent) {
          throw new Error('找不到简历内容元素');
        }
        
        // 显示加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        `;
        loadingIndicator.innerHTML = '<p style="font-size: 18px;">正在生成PDF，请稍候...</p>';
        document.body.appendChild(loadingIndicator);
        
        // 使用html2canvas将HTML转换为canvas
        html2canvas(resumeContent, {
          scale: 2, // 提高分辨率
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
          
          // 移除加载指示器
          document.body.removeChild(loadingIndicator);
          
          // 保存PDF
          doc.save('任毅_个人简历.pdf');
        }).catch(error => {
          console.error('PDF生成失败:', error);
          document.body.removeChild(loadingIndicator);
          alert('PDF生成失败，请稍后再试');
        });
      } catch (error) {
        console.error('PDF导出失败:', error);
        alert('PDF导出失败，请稍后再试');
      }
    });
  }
}

/**
 * 背景效果初始化
 */
function initBackgroundEffects() {
  // 添加微妙的背景动画效果
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.classList.add('background-particle');
    
    // 随机位置
    const posX = utils.random(0, 100);
    const posY = utils.random(0, 100);
    
    // 随机大小
    const size = utils.random(20, 100);
    
    // 随机透明度
    const opacity = utils.random(0.02, 0.07);
    
    // 随机颜色
    const colors = ['59, 130, 246', '139, 92, 246', '99, 102, 241'];
    const color = colors[Math.floor(utils.random(0, colors.length))];
    
    // 设置样式
    particle.style.cssText = `
      position: fixed;
      top: ${posY}%;
      left: ${posX}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(${color}, ${opacity}) 0%, rgba(${color}, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      filter: blur(${size / 10}px);
      animation: float ${utils.random(15, 25)}s infinite ease-in-out;
    `;
    
    document.body.appendChild(particle);
  };
  
  // 创建粒子 (根据设备性能调整数量)
  const particleCount = window.innerWidth > 768 ? 10 : 5;
  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }
  
  // 添加浮动动画
  const generateRandomOffset = () => utils.random(-15, 15);
  
  const floatAnimation = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(${generateRandomOffset()}px, ${generateRandomOffset()}px); }
      50% { transform: translate(${generateRandomOffset()}px, ${generateRandomOffset()}px); }
      75% { transform: translate(${generateRandomOffset()}px, ${generateRandomOffset()}px); }
    }
  `;
  
  const animStyle = document.createElement('style');
  animStyle.textContent = floatAnimation;
  document.head.appendChild(animStyle);
}
