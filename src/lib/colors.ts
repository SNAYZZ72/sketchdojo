/**
 * Maps chat message roles to color names for styling
 */
export function roleToColor(role: string): string {
  switch (role) {
    case 'system':
      return 'gray';
    case 'assistant':
      return 'purple';
    case 'user':
      return 'blue';
    default:
      return 'gray';
  }
} 