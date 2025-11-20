const Responsive = {
    designWidth: 1920,
    designHeight: 1080,
  
    vw: (px) => `${(px / 1920) * 100}vw`,
    vh: (px) => `${(px / 1080) * 100}vh`,
};

export default Responsive;