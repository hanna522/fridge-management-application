import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CategorySlider({ categories, setFilterValue }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    speed: 600,
    slidesToScroll: 1,
    swipeToSlide: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 393,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        sliderRef.current.slickPrev();
      } else {
        sliderRef.current.slickNext();
      }
    };

    const sliderElement = sliderRef.current.innerSlider.list;
    sliderElement.addEventListener("wheel", handleWheel);

    return () => {
      sliderElement.removeEventListener("wheel", handleWheel);
    };
  }, []);


  return (
    <div className="fridge-filtering">
      <Slider ref={sliderRef} {...settings} className="filtering">
        <div key="All" className="slider-item">
          <button onClick={() => setFilterValue("")}>All</button>
        </div>
        {categories.category_list.map((category) => (
          <div key={category.name} className="slider-item">
            <button onClick={() => setFilterValue(category.name)}>
              {category.name}
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CategorySlider;
