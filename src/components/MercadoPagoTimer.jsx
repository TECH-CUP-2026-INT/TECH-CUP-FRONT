import React, { useState, useEffect, useRef } from 'react';

const classNames = (base, conds) => {
  return [base, ...Object.keys(conds).filter(k => conds[k])].join(' ');
};

const TimerChar = ({ char }) => {
  const ref = useRef(null);
  const colon = char === ":";

  if (colon) {
    return <h1 className="timer-char colon">:</h1>;
  }

  const number = parseInt(char);

  const getCharSlider = () => {
    let options = [];

    for (let i = 0; i <= 9; i++) {
      const classes = classNames("timer-char-slider-option", {
        active: number === i
      });
      options.push(<span key={i} className={classes}>{i}</span>);
    }

    const height = ref.current ? ref.current.offsetHeight : 0;
    const top = `${number * height * -1}px`;

    return (
      <div className="timer-char-slider" style={{ top }}>{options}</div>
    );
  };

  return (
    <div ref={ref} className="timer-char number">
      {getCharSlider()}
    </div>
  );
};

const Timer = () => {
  const [date, setDateTo] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const update = new Date();
      if (update.getSeconds() !== date.getSeconds()) {
        setDateTo(update);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [date]);

  const formatSegment = (segment) => {
    return segment < 10 ? `0${segment}` : segment;
  };

  const getHours = (hours) => {
    const formatted = hours % 12 === 0 ? 12 : hours % 12;
    return formatted;
  };

  const getTime = () => {
    const hours = getHours(date.getHours());
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${formatSegment(hours)}:${formatSegment(minutes)}:${formatSegment(seconds)}`;
  };

  const getChars = () => {
    return getTime().split("").map((char, index) => (
      <TimerChar key={index} char={char} />
    ));
  };

  return (
    <div className="mercadopago-container">
      <img 
        src="https://img.icons8.com/color/512/mercado-pago.png" 
        alt="Mercado Pago" 
        className="mp-logo" 
      />
      <div id="timer">
        <div id="timer-text">{getChars()}</div>
      </div>
    </div>
  );
};

const styles = `
#app {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100%;
}

.mercadopago-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mp-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

#timer {
  background: linear-gradient(to bottom right, rgba(2, 99, 225, 1.0), rgba(235, 24, 54, 1.0));
  border-radius: 22px;
}

#timer-text {
  align-items: center;
  background-color: #1E1E1E;
  border-radius: 20px;
  display: flex;
  margin: 4px;
  padding: 0px 20px;
}

.timer-char {
  height: 150px;
  position: relative;
  text-align: center;
  width: 80px;
}

.timer-char.colon {
  color: white;
  font-size: 8em;
  line-height: 150px;
  width: 40px;
}

.timer-char .timer-char-slider {
  display: flex;
  flex-direction: column;
  left: 0px;
  position: absolute;
  top: 0px;
  transition: top 200ms;
  width: 80px;
}

.timer-char .timer-char-slider .timer-char-slider-option {
  color: white;
  font-size: 4em;
  height: 150px;
  line-height: 150px;
  opacity: 0.05;
  transition: opacity 400ms, font-size 400ms;
  width: 80px;
}

.timer-char .timer-char-slider .timer-char-slider-option.active {
  font-size: 8em;
  opacity: 1;
}

@media(max-width: 800px) {
  #timer { border-radius: 16px; }
  #timer-text { border-radius: 14px; margin: 4px; padding: 0px 12px; }
  .timer-char { height: 80px; width: 40px; }
  .timer-char.colon { font-size: 4em; line-height: 80px; }
  .timer-char .timer-char-slider { width: 40px; }
  .timer-char .timer-char-slider .timer-char-slider-option { font-size: 2em; height: 80px; line-height: 80px; width: 40px; }
  .timer-char .timer-char-slider .timer-char-slider-option.active { font-size: 4em; }
}

@media(max-width: 400px) {
  #timer { border-radius: 8px; }
  #timer-text { border-radius: 6px; margin: 2px; padding: 0px 10px; }
  .timer-char { height: 40px; width: 20px; }
  .timer-char.colon { font-size: 2em; line-height: 40px; }
  .timer-char .timer-char-slider { width: 20px; }
  .timer-char .timer-char-slider .timer-char-slider-option { font-size: 1.25em; height: 40px; line-height: 40px; width: 20px; }
  .timer-char .timer-char-slider .timer-char-slider-option.active { font-size: 2em; }
}
`;

export default function MercadoPagoTimer() {
  return (
    <>
      <style>{styles}</style>
      <div id="app">
        <Timer />
      </div>
    </>
  );
}
