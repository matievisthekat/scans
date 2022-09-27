import React, {useState} from 'react';

interface Props {
  onChange?: (value: number) => void;
  disabled?: boolean;
}

function AnswerOptions({ onChange, disabled }: Props) {
  const [selected, setSelected] = useState(-1);

  return (
    <div className={'answer'}>
      <span id={'disagree-label'}>Never true</span>
      {[...Array(6)].map((_, i) => {
        const side = i <= 1 ? 'disagree' : i === 2 || i === 3 ? 'neutral' : 'agree';
        const checked = selected === i;
        return (
          <div
            role={'radio'}
            aria-checked={checked}
            tabIndex={i + 1}
            className={`option level-${i} ${side} ${disabled ? 'disabled' : ''}`}
            id={checked ? 'selected' : ''}
            key={i}
            onClick={() => {
              if (!disabled) {
                setSelected(i);
                if (onChange) onChange(i);
              }
            }}
          >
            <svg height="100%" width="100%"></svg>
          </div>
        )
      })}
      <span id={'agree-label'}>Always true</span>
    </div>
  );
}

export default AnswerOptions;