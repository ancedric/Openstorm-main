import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function SlideElement({ slideData, classStyle }) {
    const [isVisible, setIsVisible] = useState(true)

    const handleScroll =() => {
      const slideElement = document.querySelector('#slide-element')
      if(slideElement){
        const elementTop = slideElement.getBoundingClientRect().top
        const elementBottom = slideElement.getBoundingClientRect().bottom

        setIsVisible(elementTop < window.innerHeight && elementBottom >= 0)
      }
    }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <h2 id="slide-element" className={`${classStyle} ${isVisible ? 'appear' : slideData.typeOut}`}>
      {slideData.content}
    </h2>

  )
}
SlideElement.propTypes = {
  slideData: PropTypes.shape({
    typeOut: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }) ,
  classStyle: PropTypes.string.isRequired,
}
export default SlideElement