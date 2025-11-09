import React from 'react';

interface Props {
  disabled?: boolean;
  onSubmit: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ disabled, onSubmit }) => {
  const [value, setValue] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue('');
  };

  const isDisabled = disabled || !value.trim();

  return (
    <form className="form" onSubmit={submit}>
      <textarea
        placeholder="Type your prompt..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        aria-label="Prompt"
      />
      <button className="submit" type="submit" disabled={isDisabled} aria-label="Send">
        {disabled ? 'Thinking…' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;
