declare module "vanta/dist/vanta.birds.min" {
    export default function BIRDS(options: {
      el: HTMLElement;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      backgroundColor?: number;
      color1?: number;
      color2?: number;
      colorMode?: string;
      speedLimit?: number;
      cohesion?: number;
    }): {
      setOptions: (options: object) => void;
      resize: () => void;
      destroy: () => void;
    };
  }
  