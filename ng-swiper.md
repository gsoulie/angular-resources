[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Swiper JS

Exemple d'implémentation de SwiperJS

 *swiper.scss*
 
 ````css 
.carousel__wrapper {
  .swiper {
    width: 100%;
    height: auto;
  }

  .swiper-slide {
    max-width: 200px;
    /*min-width: 500px;*/
    flex-shrink: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    padding-bottom: 1rem;
    border: 1px solid blue;
  }

  .swiper-slide>li {
    list-style: none;
    padding: 0;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-button-next,
  .swiper-button-prev {
    height: 44px;
    width: 44px;
    background-color: $blue200;
    background-position: center;
    background-size: 20px;
    background-repeat: no-repeat;
    color: white;
    border-radius: 100%;
  }

  .swiper-button-next {
    background-image: url('/icons/arrow-right.svg');	// DEFINIR DES PICTO POUR LES FLECHES
  }

  .swiper-button-prev {
    background-image: url('/icons/arrow-left.svg');	// DEFINIR DES PICTO POUR LES FLECHES
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    content: '';
    background-image: none;
  }

  .swiper .swiper-button-next:hover,
  .swiper .swiper-button-prev:hover {
    background-color: var(--color-brand-primary-darken) !important;
  }
}
````


*carousel.tsx*
````typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';

const ProductCarousel = (props: ProductCarouselProps) => {

 return (
    <div className="carousel__wrapper">
      <h1 className="capitalize">{props.title}</h1>

      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: "auto",
            spaceBetween: 30,
          },
          1536: {
            slidesPerView: "auto",
            spaceBetween: 40,
          },
          1792: {
            slidesPerView: "auto",
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        navigation={true}
      >
        {sortedProducts.map((product, i) => (
          <SwiperSlide key={product.codeArticle}>
            <div style={{ width: "200px", border: "1px solid orange" }}>
              <img src={product.photo} loading="lazy" width={"100%"}></img>
              <span>{product.libelleArticle}</span>
            </div>
		</SwiperSlide>
		))}
	</Swiper>
	</div>
	);
}
````
