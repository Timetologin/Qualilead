import React from 'react';
import { useInView } from '../hooks/useAnimations';

// Animated section wrapper
export const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0 
}) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${animation} ${isInView ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Section header component
export const SectionHeader = ({ badge, title, description, className = '' }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className={`section-header ${className}`}>
      {badge && (
        <span className={`section-badge fade-in ${isInView ? 'visible' : ''}`}>
          {badge}
        </span>
      )}
      <h2 className={`section-title fade-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
        {title}
      </h2>
      {description && (
        <p className={`section-description fade-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          {description}
        </p>
      )}
    </div>
  );
};

// Card with hover animation
export const AnimatedCard = ({ 
  children, 
  className = '',
  delay = 0,
  animation = 'fade-in'
}) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${animation} ${isInView ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Staggered list animation
export const StaggeredList = ({ children, baseDelay = 0, staggerDelay = 100 }) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <AnimatedSection delay={baseDelay + index * staggerDelay}>
          {child}
        </AnimatedSection>
      ))}
    </>
  );
};

// Count up number display
export const CountUpNumber = ({ value, suffix = '', prefix = '' }) => {
  const [ref, isInView] = useInView({ threshold: 0.5 });
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(numericValue * easeOutQuart));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(numericValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, hasAnimated]);

  return (
    <span ref={ref} className="count-up">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default {
  AnimatedSection,
  SectionHeader,
  AnimatedCard,
  StaggeredList,
  CountUpNumber,
};
