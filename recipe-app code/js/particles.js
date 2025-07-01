class ParticleSystem {
  constructor() {
    this.container = document.getElementById("particles")
    this.particles = []
    this.maxParticles = 50
    this.init()
  }

  init() {
    this.createParticles()
    this.animate()
  }

  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.createParticle()
    }
  }

  createParticle() {
    const particle = document.createElement("div")
    particle.className = "particle"

    const size = Math.random() * 4 + 1
    const left = Math.random() * 100
    const animationDuration = Math.random() * 20 + 10
    const delay = Math.random() * 20

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${animationDuration}s;
      animation-delay: ${delay}s;
    `

    this.container.appendChild(particle)
    this.particles.push(particle)
  }

  animate() {
    // Particles are animated via CSS animations
    // This method can be extended for more complex animations
  }
}

// Initialize particles when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ParticleSystem()
})
