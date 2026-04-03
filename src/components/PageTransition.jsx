import { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

export function PageTransition({ transitionKey, className = '', children }) {
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={transitionKey}
        nodeRef={nodeRef}
        timeout={260}
        classNames="route-motion"
        mountOnEnter
        unmountOnExit
      >
        <div ref={nodeRef} className={className}>
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
