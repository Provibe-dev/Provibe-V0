import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const words = ["Go from Vibe to Vision", "in just a few minutes"]
const typingSpeed = 80
const pauseTime = 1200

export function TypewriterHeadline() {
  const [displayedText, setDisplayedText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    let timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentWord.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
        if (charIndex === currentWord.length) {
          setIsDeleting(true)
          setTimeout(() => {}, pauseTime)
        }
      } else {
        setDisplayedText(currentWord.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
        if (charIndex === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
      <motion.span
        className="gradient-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        {displayedText}
        <span className="text-emerald-400">|</span>
      </motion.span>
    </h1>
  )
}
