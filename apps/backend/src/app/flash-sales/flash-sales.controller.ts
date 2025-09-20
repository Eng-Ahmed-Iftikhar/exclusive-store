import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import {
  CreateFlashSaleDto,
  UpdateFlashSaleDto,
  CreateFlashSaleItemDto,
  UpdateFlashSaleItemDto,
  FlashSaleResponseDto,
  FlashSaleItemResponseDto,
} from './dto/flash-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FlashSaleItemDto } from './dto/flash-sale.dto';

@Controller('flash-sales')
@ApiTags('FlashSales')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  // ===== PUBLIC ENDPOINTS =====

  @Get('active')
  async getActiveFlashSales(): Promise<FlashSaleResponseDto[]> {
    return this.flashSalesService.getActiveFlashSales();
  }

  @Get(':id')
  async getFlashSaleById(
    @Param('id') id: string
  ): Promise<FlashSaleResponseDto> {
    return this.flashSalesService.getFlashSaleById(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get flash sale items in items API format' })
  @ApiParam({ name: 'id', description: 'Flash sale ID' })
  @ApiResponse({
    status: 200,
    description: 'Flash sale items retrieved successfully',
    type: [FlashSaleItemDto],
  })
  @ApiResponse({ status: 404, description: 'Flash sale not found' })
  async getFlashSaleItems(
    @Param('id') id: string
  ): Promise<FlashSaleItemDto[]> {
    return this.flashSalesService.getFlashSaleItems(id);
  }

  // ===== ADMIN ENDPOINTS =====

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlashSale(
    @Body() createFlashSaleDto: CreateFlashSaleDto
  ): Promise<FlashSaleResponseDto> {
    return this.flashSalesService.createFlashSale(createFlashSaleDto);
  }

  @Put(':id')
  async updateFlashSale(
    @Param('id') id: string,
    @Body() updateFlashSaleDto: UpdateFlashSaleDto
  ): Promise<FlashSaleResponseDto> {
    return this.flashSalesService.updateFlashSale(id, updateFlashSaleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFlashSale(@Param('id') id: string): Promise<void> {
    return this.flashSalesService.deleteFlashSale(id);
  }

  // ===== FLASH SALE ITEMS =====

  @Post(':id/items')
  @HttpCode(HttpStatus.CREATED)
  async addItemToFlashSale(
    @Param('id') flashSaleId: string,
    @Body() createFlashSaleItemDto: CreateFlashSaleItemDto
  ): Promise<FlashSaleItemResponseDto> {
    return this.flashSalesService.addItemToFlashSale(
      flashSaleId,
      createFlashSaleItemDto
    );
  }

  @Put('items/:id')
  async updateFlashSaleItem(
    @Param('id') id: string,
    @Body() updateFlashSaleItemDto: UpdateFlashSaleItemDto
  ): Promise<FlashSaleItemResponseDto> {
    return this.flashSalesService.updateFlashSaleItem(
      id,
      updateFlashSaleItemDto
    );
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItemFromFlashSale(@Param('id') id: string): Promise<void> {
    return this.flashSalesService.removeItemFromFlashSale(id);
  }
}
