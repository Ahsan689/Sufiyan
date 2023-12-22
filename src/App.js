import React, {useEffect} from 'react';
import logo from './logo.svg';
// import './App.css';
// import './glightbox.css';
import {Helmet} from "react-helmet";
import Isotope from 'isotope-layout';
import GLightbox from 'glightbox';
import Swiper from 'swiper';
import './css/style.css'
import './css/heroanimation.css'
import 'swiper/swiper-bundle.css';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useExternalScripts from './ExternalScript';
gsap.registerPlugin(ScrollTrigger);





function App() {

   
  
  useEffect(() => {


       /**
    * Easy selector helper function
    */
       const select = (el, all = false) => {
        el = el.trim()
        if (all) {
          return [...document.querySelectorAll(el)]
        } else {
          return document.querySelector(el)
        }
        }
    
        /**
        * Easy event listener function
        */
        const on = (type, el, listener, all = false) => {
          let selectEl = select(el, all)
          if (selectEl) {
            if (all) {
              selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
              selectEl.addEventListener(type, listener)
            }
          }
        }
           /**
       * Scrolls to an element with header offset
       */
           const scrollto = (el) => {
            let header = select('#header')
            let offset = header.offsetHeight
        
            if (!header.classList.contains('header-scrolled')) {
              offset -= 20
            }
        
            let elementPos = select(el).offsetTop
            window.scrollTo({
              top: elementPos - offset,
              behavior: 'smooth'
            })
          }
    
            /**
         * Mobile nav toggle
         */
            on('click', '.mobile-nav-toggle', function(e) {
              console.log( select('#navbar').classList,"navbar.classList");
              select('#navbar').classList.add('navbar-mobile')
              this.classList.add('bi-list')
              this.classList.add('bi-x')
            })
        
              /**
           * Mobile nav dropdowns activate
           */
          on('click', '.navbar .dropdown > a', function(e) {
            if (select('#navbar').classList.contains('navbar-mobile')) {
              e.preventDefault()
              this.nextElementSibling.classList.add('dropdown-active')
            }
          }, true)
        
        
           /**
           * Scrool with ofset on links with a class name .scrollto
           */
           on('click', '.scrollto', function(e) {
            if (select(this.hash)) {
              e.preventDefault()
        
              let navbar = select('#navbar')
              console.log(navbar,"navbar.classList");
              if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
              }
              scrollto(this.hash)
            }
          }, true)
 
 
    /**
   * Testimonials slider
   */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });

      /**
   * Portfolio details slider
   */
      new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });


  /**
   * Easy on scroll event listener 
   */
   const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  
   /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          console.log(window.scrollY)
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
      
    }

      /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  


  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

      }, true);
    }

  });

 
    /**
   * Initiate portfolio lightbox 
   */
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });

    let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  let proxy = { skew: 0 },
  skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"), // fast
  clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees. 

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300);
      // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
      }
    }
  });

  // make the right edge "stick" to the scroll bar. force3D: true improves performance
  gsap.set(".skewElem", {transformOrigin: "right center", force3D: true});
 





  }, []);

 
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <>
   
  {/* ======= Header ======= */}
  {/* <Helmet>
     <script src = "./js/main.js" type = "text/javascript" />
     <script src = "./vendor/purecounter/purecounter_vanilla.js" type = "text/javascript" />
     <script src = "./vendor/bootstrap/js/bootstrap.js" type = "text/javascript" />
  </Helmet> */}
  <header id="header" className="fixed-top d-flex justify-content-center align-items-center header-transparent">
    <nav id="navbar" className="navbar" >
      <ul >
        <li><a style={{marginRight:50}} className="nav-link scrollto active" href="#hero"><img width={50} height={50} src="/assets/img/HOME.png" alt/></a></li>
        <li><a style={{marginRight:50}} className="nav-link scrollto" href="#about"><img  width={50} height={50} src="/assets/img/ABOUT US.png" alt/></a></li>
        <li><a style={{marginRight:50}} className="nav-link scrollto" href="#services"><img  width={48} height={48} src="/assets/img/SERVICES.png" alt/></a></li>
        <li><a style={{marginRight:50}} className="nav-link scrollto " href="#portfolio"><img width={50} height={50} src="/assets/img/portfolio.png" alt/></a></li>
        {/* <li className="dropdown"><a href="#"><span>Drop Down</span> <i className="bi bi-chevron-down" /></a>
          <ul>
            <li><a href="#">Drop Down 1</a></li>
            <li className="dropdown"><a href="#"><span>Deep Drop Down</span> <i className="bi bi-chevron-right" /></a>
              <ul>
                <li><a href="#">Deep Drop Down 1</a></li>
                <li><a href="#">Deep Drop Down 2</a></li>
                <li><a href="#">Deep Drop Down 3</a></li>
                <li><a href="#">Deep Drop Down 4</a></li>
                <li><a href="#">Deep Drop Down 5</a></li>
              </ul>
            </li>
            <li><a href="#">Drop Down 2</a></li>
            <li><a href="#">Drop Down 3</a></li>
            <li><a href="#">Drop Down 4</a></li>
          </ul>
        </li> */}
        <li><a className="nav-link scrollto" href="#contact"><img width={50} height={50} src="/assets/img/CONTACT US.png" alt/></a></li>
      </ul>
      <i className="bi bi-list mobile-nav-toggle" />
    </nav>{/* .navbar */}
  </header>{/* End Header */}
  {/* ======= Hero Section ======= */}


  <section id="hero">
    <div className="hero-container">
      <h1>Laura Thomson</h1>
      <h2>I'm a Professional Photographer In New York City</h2>
      <a href="#about" className="btn-scroll scrollto" title="Scroll Down"><i className="bx bx-chevron-down" /></a>
    </div>
  </section>
  <div style={{justifyContent:'center', margin:"5%"}}>

<img width={400} height={400} src="/assets/img/01-26 (1).jpg" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/02-28 (1).jpg" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/04-23 (1).jpg" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/03.png" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/04.png" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/05.png" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/VIEW 01.jpg" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/VIEW 02.jpg" alt className="skewElem" />
<img width={400} height={400} src="/assets/img/VIEW 03.jpg" alt className="skewElem" />
{/* <img width={400} height={400} src="/assets/img/" alt className="skewElem" /> */}

</div>
  {/* End Hero */}
  <main id="main">
    {/* ======= About Me Section ======= */}
    <section id="about" className="about">
      <div className="container">
        <div className="section-title">
          <span>About Me</span>
          <h2>About Me</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <div className="row">
          <div className="image col-lg-4 d-flex align-items-stretch justify-content-center justify-content-lg-start" />
          <div className="col-lg-8 d-flex flex-column align-items-stretch">
            <div className="content ps-lg-4 d-flex flex-column justify-content-center">
              {/* <div className="row">
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right" /> <strong>Name:</strong> <span>Laura Thomso</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>Website:</strong> <span>www.example.com</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>Phone:</strong> <span>+123 456 7890</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>City:</strong> <span>New York, USA</span></li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right" /> <strong>Age:</strong> <span>30</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>Degree:</strong> <span>Master</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>PhEmailone:</strong> <span>email@example.com</span></li>
                    <li><i className="bi bi-chevron-right" /> <strong>Freelance:</strong> <span>Available</span></li>
                  </ul>
                </div>
              </div> */}
              <div className="row mt-n4">
                <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                  <div className="count-box">
                    <i className="bi bi-emoji-smile" style={{color: '#20b38e'}} />
                    <span data-purecounter-start={0} data-purecounter-end={232} data-purecounter-duration={1} className="purecounter" />
                    <p><strong>Happy Clients</strong> consequuntur voluptas nostrum aliquid ipsam architecto ut.</p>
                  </div>
                </div>
                <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                  <div className="count-box">
                    <i className="bi bi-journal-richtextr" style={{color: '#8a1ac2'}} />
                    <span data-purecounter-start={0} data-purecounter-end={521} data-purecounter-duration={1} className="purecounter" />
                    <p><strong>Projects</strong> adipisci atque cum quia aspernatur totam laudantium et quia dere tan</p>
                  </div>
                </div>
                <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                  <div className="count-box">
                    <i className="bi bi-clock" style={{color: '#2cbdee'}} />
                    <span data-purecounter-start={0} data-purecounter-end={18} data-purecounter-duration={1} className="purecounter" />
                    <p><strong>Years of experience</strong> aut commodi quaerat modi aliquam nam ducimus aut voluptate non vel</p>
                  </div>
                </div>
                <div className="col-md-6 mt-5 d-md-flex align-items-md-stretch">
                  <div className="count-box">
                    <i className="bi bi-award" style={{color: '#ffb459'}} />
                    <span data-purecounter-start={0} data-purecounter-end={16} data-purecounter-duration={1} className="purecounter" />
                    <p><strong>Awards</strong> rerum asperiores dolor alias quo reprehenderit eum et nemo pad der</p>
                  </div>
                </div>
              </div>
            </div>{/* End .content*/}
            {/* <div className="skills-content ps-lg-4">
              <div className="progress">
                <span className="skill">HTML <i className="val">100%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
              <div className="progress">
                <span className="skill">CSS <i className="val">90%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
              <div className="progress">
                <span className="skill">JavaScript <i className="val">75%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>{/* End About Me Section */}
    {/* ======= My Resume Section ======= */}
    {/* <section id="resume" className="resume">
      <div className="container">
        <div className="section-title">
          <span>My Resume</span>
          <h2>My Resume</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">Sumary</h3>
            <div className="resume-item pb-0">
              <h4>Alice Barkley</h4>
              <p><em>Innovative and deadline-driven Graphic Designer with 3+ years of experience designing and developing user-centered digital/print marketing material from initial concept to final, polished deliverable.</em></p>
              <p>
              </p><ul>
                <li>Portland par 127,Orlando, FL</li>
                <li>(123) 456-7891</li>
                <li>alice.barkley@example.com</li>
              </ul>
              <p />
            </div>
            <h3 className="resume-title">Education</h3>
            <div className="resume-item">
              <h4>Master of Fine Arts &amp; Graphic Design</h4>
              <h5>2015 - 2016</h5>
              <p><em>Rochester Institute of Technology, Rochester, NY</em></p>
              <p>Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui ut dignissimos deleniti nerada porti sand markend</p>
            </div>
            <div className="resume-item">
              <h4>Bachelor of Fine Arts &amp; Graphic Design</h4>
              <h5>2010 - 2014</h5>
              <p><em>Rochester Institute of Technology, Rochester, NY</em></p>
              <p>Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart dila</p>
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="resume-title">Professional Experience</h3>
            <div className="resume-item">
              <h4>Senior graphic design specialist</h4>
              <h5>2019 - Present</h5>
              <p><em>Experion, New York, NY </em></p>
              <p>
              </p><ul>
                <li>Lead in the design, development, and implementation of the graphic, layout, and production communication materials</li>
                <li>Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project. </li>
                <li>Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design</li>
                <li>Oversee the efficient use of production project budgets ranging from $2,000 - $25,000</li>
              </ul>
              <p />
            </div>
            <div className="resume-item">
              <h4>Graphic design specialist</h4>
              <h5>2017 - 2018</h5>
              <p><em>Stepping Stone Advertising, New York, NY</em></p>
              <p>
              </p><ul>
                <li>Developed numerous marketing programs (logos, brochures,infographics, presentations, and advertisements).</li>
                <li>Managed up to 5 projects or tasks at a given time while under pressure</li>
                <li>Recommended and consulted with clients on the most appropriate graphic design</li>
                <li>Created 4+ design presentations and proposals a month for clients and account managers</li>
              </ul>
              <p />
            </div>
          </div>
        </div>
      </div>
    </section> */}
    {/* End My Resume Section */}
    {/* ======= My Services Section ======= */}
    <section id="services" className="services">
      <div className="container">
        <div className="section-title">
          <span>My Services</span>
          <h2>My Services</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box">
              <div className="icon"><i className="bx bxl-dribbble" /></div>
              <h4 className="title"><a href>Lorem Ipsum</a></h4>
              <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-file" /></div>
              <h4 className="title"><a href>Sed ut perspiciatis</a></h4>
              <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-tachometer" /></div>
              <h4 className="title"><a href>Magni Dolores</a></h4>
              <p className="description">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box">
              <div className="icon"><i className="bx bx-world" /></div>
              <h4 className="title"><a href>Nemo Enim</a></h4>
              <p className="description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque</p>
            </div>
          </div>
        </div>
      </div>
    </section>{/* End My Services Section */}
    {/* ======= Testimonials Section ======= */}
    <section id="testimonials" className="testimonials">
      <div className="container position-relative">
        <div className="testimonials-slider swiper" data-aos="fade-up" data-aos-delay={100}>
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="testimonial-item">
                <img src="assets/img/testimonials/testimonials-1.jpg" className="testimonial-img" alt />
                <h3>Saul Goodman</h3>
                <h4>Ceo &amp; Founder</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </div>{/* End testimonial item */}
            <div className="swiper-slide">
              <div className="testimonial-item">
                <img src="assets/img/testimonials/testimonials-2.jpg" className="testimonial-img" alt />
                <h3>Sara Wilsson</h3>
                <h4>Designer</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </div>{/* End testimonial item */}
            <div className="swiper-slide">
              <div className="testimonial-item">
                <img src="assets/img/testimonials/testimonials-3.jpg" className="testimonial-img" alt />
                <h3>Jena Karlis</h3>
                <h4>Store Owner</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </div>{/* End testimonial item */}
            <div className="swiper-slide">
              <div className="testimonial-item">
                <img src="assets/img/testimonials/testimonials-4.jpg" className="testimonial-img" alt />
                <h3>Matt Brandon</h3>
                <h4>Freelancer</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </div>{/* End testimonial item */}
            <div className="swiper-slide">
              <div className="testimonial-item">
                <img src="assets/img/testimonials/testimonials-5.jpg" className="testimonial-img" alt />
                <h3>John Larson</h3>
                <h4>Entrepreneur</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid.
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </div>{/* End testimonial item */}
          </div>
          <div className="swiper-pagination" />
        </div>
      </div>
    </section>{/* End Testimonials Section */}
    {/* ======= My Portfolio Section ======= */}
    <section id="portfolio" className="portfolio">
      <div className="container">
        <div className="section-title">
          <span>My Portfolio</span>
          <h2>My Portfolio</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <ul id="portfolio-flters" className="d-flex justify-content-center">
          <li data-filter="*" className="filter-active">All</li>
          <li data-filter=".filter-app">App</li>
          <li data-filter=".filter-card">Card</li>
          <li data-filter=".filter-web">Web</li>
        </ul>
        <div className="row portfolio-container">
          <div className="col-lg-4 col-md-6 portfolio-item filter-app">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-1.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>App 1</h4>
              <p>App</p>
              <a href="assets/img/portfolio/portfolio-1.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 1"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-web">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-2.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Web 3</h4>
              <p>Web</p>
              <a href="assets/img/portfolio/portfolio-2.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 3"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-app">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-3.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>App 2</h4>
              <p>App</p>
              <a href="assets/img/portfolio/portfolio-3.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 2"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-card">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-4.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Card 2</h4>
              <p>Card</p>
              <a href="assets/img/portfolio/portfolio-4.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 2"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-web">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-5.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Web 2</h4>
              <p>Web</p>
              <a href="assets/img/portfolio/portfolio-5.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 2"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-app">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-6.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>App 3</h4>
              <p>App</p>
              <a href="assets/img/portfolio/portfolio-6.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 3"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-card">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-7.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Card 1</h4>
              <p>Card</p>
              <a href="assets/img/portfolio/portfolio-7.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 1"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-card">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-8.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Card 3</h4>
              <p>Card</p>
              <a href="assets/img/portfolio/portfolio-8.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 3"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 portfolio-item filter-web">
            <div className="portfolio-img"><img src="assets/img/portfolio/portfolio-9.jpg" className="img-fluid" alt /></div>
            <div className="portfolio-info">
              <h4>Web 3</h4>
              <p>Web</p>
              <a href="assets/img/portfolio/portfolio-9.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 3"><i className="bx bx-plus" /></a>
              <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>{/* End My Portfolio Section */}
    {/* ======= Pricing Section ======= */}
    {/* <section id="pricing" className="pricing">
      <div className="container">
        <div className="section-title">
          <span>Pricing</span>
          <h2>Pricing</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="box">
              <h3>Free</h3>
              <h4><sup>$</sup>0<span> / month</span></h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li className="na">Pharetra massa</li>
                <li className="na">Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">Buy Now</a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-4 mt-md-0">
            <div className="box featured">
              <h3>Business</h3>
              <h4><sup>$</sup>19<span> / month</span></h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li>Pharetra massa</li>
                <li className="na">Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">Buy Now</a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-4 mt-lg-0">
            <div className="box">
              <h3>Developer</h3>
              <h4><sup>$</sup>29<span> / month</span></h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li>Pharetra massa</li>
                <li>Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">Buy Now</a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-4 mt-lg-0">
            <div className="box">
              <span className="advanced">Advanced</span>
              <h3>Ultimate</h3>
              <h4><sup>$</sup>49<span> / month</span></h4>
              <ul>
                <li>Aida dere</li>
                <li>Nec feugiat nisl</li>
                <li>Nulla at volutpat dola</li>
                <li>Pharetra massa</li>
                <li>Massa ultricies mi</li>
              </ul>
              <div className="btn-wrap">
                <a href="#" className="btn-buy">Buy Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> */}
    {/* End Pricing Section */}
    {/* ======= Contact Me Section ======= */}
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <span>Contact Me</span>
          <h2>Contact Me</h2>
          <p>Sit sint consectetur velit quisquam cupiditate impedit suscipit alias</p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="row">
              <div className="col-md-12">
                <div className="info-box">
                  <i className="bx bx-share-alt" />
                  <h3>Social Profiles</h3>
                  <div className="social-links">
                    <a href="#" className="twitter"><i className="bi bi-twitter" /></a>
                    <a href="#" className="facebook"><i className="bi bi-facebook" /></a>
                    <a href="#" className="instagram"><i className="bi bi-instagram" /></a>
                    <a href="#" className="google-plus"><i className="bi bi-skype" /></a>
                    <a href="#" className="linkedin"><i className="bi bi-linkedin" /></a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-box mt-4">
                  <i className="bx bx-envelope" />
                  <h3>Email Me</h3>
                  <p>contact@example.com</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-box mt-4">
                  <i className="bx bx-phone-call" />
                  <h3>Call Me</h3>
                  <p>+1 5589 55488 55</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <form action="forms/contact.php" method="post" role="form" className="php-email-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                </div>
              </div>
              <div className="form-group mt-3">
                <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
              </div>
              <div className="form-group mt-3">
                <textarea className="form-control" name="message" rows={6} placeholder="Message" required defaultValue={""} />
              </div>
              <div className="my-3">
                <div className="loading">Loading</div>
                <div className="error-message" />
                <div className="sent-message">Your message has been sent. Thank you!</div>
              </div>
              <div className="text-center"><button type="submit">Send Message</button></div>
            </form>
          </div>
        </div>
      </div>
    </section>{/* End Contact Me Section */}
  </main>{/* End #main */}
  {/* ======= Footer ======= */}
  <footer id="footer">
    <div className="container">
      <h3>Laura Thomson</h3>
      <p>Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni eligendi fuga maxime saepe commodi placeat.</p>
      <div className="social-links">
        <a href="#" className="twitter"><i className="bx bxl-twitter" /></a>
        <a href="#" className="facebook"><i className="bx bxl-facebook" /></a>
        <a href="#" className="instagram"><i className="bx bxl-instagram" /></a>
        <a href="#" className="google-plus"><i className="bx bxl-skype" /></a>
        <a href="#" className="linkedin"><i className="bx bxl-linkedin" /></a>
      </div>
      <div className="copyright">
        © Copyright <strong><span>Laura</span></strong>. All Rights Reserved
      </div>
      <div className="credits">
        {/* All the links in the footer should remain intact. */}
        {/* You can delete the links only if you purchased the pro version. */}
        {/* Licensing information: https://bootstrapmade.com/license/ */}
        {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/laura-free-creative-bootstrap-theme/ */}
        Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
      </div>
    </div>
  </footer>{/* End Footer */}
  <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short" /></a>


    </>
  );
}

export default App;
