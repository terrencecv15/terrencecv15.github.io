document.addEventListener('DOMContentLoaded', () => {
	const navLinks = document.querySelectorAll('.nav-link');
	const sections = document.querySelectorAll('main section, header#home');
	const menuToggle = document.querySelector('.menu-toggle');
	const scrollTopButton = document.querySelector('.scroll-top');
	const revealElements = document.querySelectorAll('.reveal');
	const progressBars = document.querySelectorAll('.progress-bar span');
	const typingTarget = document.getElementById('typing-text');
	const resumeDownload = document.getElementById('resume-download');
	const proofImages = document.querySelectorAll('.proof-image');
	const lightbox = document.getElementById('lightbox');
	const lightboxImg = document.getElementById('lightbox-img');
	const lightboxClose = document.querySelector('.lightbox-close');

	const typingWords = ['Web Developer', 'IT Graduate', 'Shopify & Wix Support'];
	let wordIndex = 0;
	let charIndex = 0;
	let typingForward = true;

	const typeLoop = () => {
		const currentWord = typingWords[wordIndex];

		if (typingForward) {
			charIndex += 1;
			typingTarget.textContent = currentWord.slice(0, charIndex);

			if (charIndex === currentWord.length) {
				typingForward = false;
				setTimeout(typeLoop, 1200);
				return;
			}
		} else {
			charIndex -= 1;
			typingTarget.textContent = currentWord.slice(0, charIndex);

			if (charIndex === 0) {
				typingForward = true;
				wordIndex = (wordIndex + 1) % typingWords.length;
			}
		}

		setTimeout(typeLoop, typingForward ? 90 : 45);
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('visible');

			if (entry.target.classList.contains('progress-section')) {
				progressBars.forEach((bar) => {
					bar.style.width = `${bar.dataset.progress}%`;
				});
			}

			observer.unobserve(entry.target);
		});
	}, {
		threshold: 0.18,
	});

	revealElements.forEach((element) => observer.observe(element));
	document.querySelectorAll('.progress-section').forEach((section) => observer.observe(section));

	const updateActiveLink = () => {
		const scrollPosition = window.scrollY + 120;

		sections.forEach((section) => {
			const top = section.offsetTop;
			const bottom = top + section.offsetHeight;
			const id = section.getAttribute('id');

			if (!id) {
				return;
			}

			if (scrollPosition >= top && scrollPosition < bottom) {
				navLinks.forEach((link) => {
					link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
				});
			}
		});

		scrollTopButton.classList.toggle('visible', window.scrollY > 500);
	};

	menuToggle.addEventListener('click', () => {
		const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!expanded));
		document.body.classList.toggle('menu-open');
	});

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 768) {
				menuToggle.setAttribute('aria-expanded', 'false');
				document.body.classList.remove('menu-open');
			}
		});
	});

	scrollTopButton.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	resumeDownload.addEventListener('click', (event) => {
		event.preventDefault();
		window.open('Resume.pdf', '_blank');
	});

	proofImages.forEach((image) => {
		image.addEventListener('click', () => {
			lightboxImg.src = image.src;
			lightbox.classList.add('active');
		});
	});

	lightboxClose.addEventListener('click', () => {
		lightbox.classList.remove('active');
	});

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			lightbox.classList.remove('active');
		}
	});

	window.addEventListener('scroll', updateActiveLink, { passive: true });
	window.addEventListener('resize', () => {
		if (window.innerWidth > 768) {
			document.body.classList.remove('menu-open');
			menuToggle.setAttribute('aria-expanded', 'false');
		}
	});

	typeLoop();
	updateActiveLink();
});
