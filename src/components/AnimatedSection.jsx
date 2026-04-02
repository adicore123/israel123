import { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(currentRef);
      }
    }, options);
    observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
  }, [options]);

  return [ref, isVisible];
};

const AnimatedSection = ({ children, className, id, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <section
      ref={ref}
      id={id}
      style={{ transitionDelay: `${delay}ms` }}
      className={`py-16 md:py-32 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className || ''}`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;
