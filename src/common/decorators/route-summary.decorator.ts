import { SetMetadata } from '@nestjs/common';

export const ROUTE_SUMMARY = 'route-summary';

export const RouteSummary = (description: string) =>
  SetMetadata(ROUTE_SUMMARY, description);
