import { useState } from 'react'
import PropTypes from 'prop-types'

const Carousel = ({slides}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex -1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const getTranslateX = () => {
    const maxIndex = slides.length - 1
    if(currentIndex === 0){
      return 0
    } else if (currentIndex === maxIndex) {
      return -(maxIndex * 100) + 100
    } else {
      return -(currentIndex * 100)
    }
  }

  return (
    <>
      {slides.map((slide, index) => (
        <div key={index} className='slide' style={{transform: `translateX(${getTranslateX()}%)`}}>
          {slide}
        </div>
      ))}
      <button className='carousel-button prev' onClick={goToPrevious}> {'<'}
      </button>
      <button className='carousel-button next' onClick={goToNext}>{'>'}
      </button>
    </>
      
  )
}

Carousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.element).isRequired,
}

export default Carousel