import type { Meta, StoryObj } from '@storybook/html';
import type { GameProps } from './Game';
import { createGame } from './Game';

const meta = {
  render: (args) => {
    let canvases = document.getElementsByName('canvas');
    canvases.forEach(canvas => {
      canvas.remove();
      
    });
    createGame(args);
    return '';
  },
  args: {},
} satisfies Meta<GameProps>;

export default meta;
type Story = StoryObj<GameProps>;

export const Primary: Story = {
  args: {},
};

