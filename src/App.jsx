import { useEffect } from "react";
import "./App.css";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

function App() {
  useEffect(() => {
    gsap.registerPlugin(CustomEase);

    const customEase = CustomEase.create("custom", ".87,0,0.13,1");
    const counter = document.getElementById("counter");

    gsap.to(".hero", {
      clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
      duration: 1.5,
      ease: customEase,
      delay: 1,
    });

    gsap.to(".hero", {
      clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
      duration: 2,
      ease: customEase,
      delay: 3,
      onStart: () => {
        gsap.to(".progress-bar", {
          width: "100vw",
          duration: 2,
          ease: customEase,
        });

        gsap.to(counter, {
          textContent: 100,
          duration: 2,
          ease: customEase,
          snap: { textContent: 1 },
        });
      },
    });

    gsap.to(".hero", {
      clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
      duration: 0.5,
      ease: customEase,
      delay: 5,
      onStart: () => {
        gsap.to(".video-container", {
          scale: 1,
          rotation: 0,
          duration: 1.25,
          ease: customEase,
        });
      },
    });

    gsap.to(".progress-bar", {
      opacity: 0,
      delay: 5,
      duration: 0.3,
    });

    gsap.to(".header span", {
      y: "0%",
      duration: 1,
      stagger: 0.125,
      ease: "power3.out",
      delay: 5.75,
    });
  }, []);

  return (
    <div className="hero">
      <div className="progress-bar">
        <p>loading</p>
        <p>
          /<span id="counter">0</span>
        </p>
      </div>

      <div className="video-container">
        <video autoPlay muted loop playsInline>
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>

      <nav>
        <p>●</p>
        <p>●</p>
      </nav>

      <footer>
        <p>This</p>
        <p>is</p>
        <p>a</p>
        <p>Short Portfolio</p>
        <p>:)</p>
      </footer>

      <div className="header">
        <h1><a href="https://www.instagram.com/rewritten_shreyas?igsh=cHd1anR2cmltMDd2" className="header-btn">INSTAGRAM</a></h1>
        <h1><a href="https://github.com/shreyas-vaid" className="header-btn">GITHUB</a></h1>
        <h1><a href="https://www.linkedin.com/in/shreyas-vaid-447b20320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="header-btn">LINKEDIN</a></h1>
        <h1><a href="mailto:test@gmail.com" className="header-btn">EMAIL</a></h1>
        <h1 className="name">SHREYAS</h1>
      </div>
    </div>
  );
}

export default App;