import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddPaymentMethodInput } from './dto/payment-method.input';

@Injectable()
export class PaymentMethodService {
  constructor(private prisma: PrismaService) {}

  async addMethod(userId: string, input: AddPaymentMethodInput) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        provider: input.provider,
        last4: input.last4,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.paymentMethod.findMany({ where: { userId } });
  }

  async deleteMethod(id: string) {
    return this.prisma.paymentMethod.delete({ where: { id } });
  }
}
