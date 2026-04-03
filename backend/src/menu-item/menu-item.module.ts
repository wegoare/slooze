import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemResolver } from './menu-item.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MenuItemResolver, MenuItemService],
})
export class MenuItemModule {}
