import React from "react";

interface Props<T> {
  dep: T[];
}

const useScrollToBottom = <T,>({ dep }: Props<T>) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
};

export default useScrollToBottom;
