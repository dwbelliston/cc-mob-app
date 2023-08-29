// Skeleton
export const Skeleton = {
    baseStyle: () => {
      return {
        startColor: 'gray.50',
        endColor: 'gray.100',
        _dark: {
            startColor: 'gray.800',
            endColor: 'gray.700',
        },
        overflow: 'hidden',
        fadeDuration: 0.1,
        speed: 1.0,
        h: '10',
        w: '100%',
      };
    },
  };

  // SkeletonText
  export const SkeletonText = {
    baseStyle: () => {
      return {
        startColor: 'gray.50',
        endColor: 'gray.100',
        _dark: {
            startColor: 'gray.800',
            endColor: 'gray.700',
        },
        fadeDuration: 0.1,
        w: '100%',
        speed: 1.0,
        flexDirection: 'column',
        _line: {
          h: 3,
          rounded: 'full',
        },
      };
    },
    defaultProps: {
      lines: 3,
      space: 3,
    },
  };