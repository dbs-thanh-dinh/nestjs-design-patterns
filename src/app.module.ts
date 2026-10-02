import { Module } from '@nestjs/common';

/**
 * AppModule dong vai tro "source NestJS trong" theo dung ke hoach ban dau.
 * Cac pattern mau khong nam trong app nay - chung song doc lap trong thu muc /sample
 * va duoc chay rieng le qua cac script `npm run sample:<ten-pattern>`.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
