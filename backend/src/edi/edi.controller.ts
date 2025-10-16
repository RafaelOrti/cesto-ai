import { Controller, Post, Get, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EdiService } from './edi.service';
import { EdiDocumentType, EdiFormat } from './entities/edi-document.entity';

@Controller('edi')
export class EdiController {
  constructor(private readonly ediService: EdiService) {}

  /**
   * Process incoming EDI document
   * POST /api/v1/edi/process
   */
  @Post('process')
  async processDocument(
    @Body() body: {
      content: string;
      format: EdiFormat;
      document_type: EdiDocumentType;
      sender_id: string;
      receiver_id: string;
    }
  ) {
    return this.ediService.processIncomingDocument(
      body.content,
      body.format,
      body.document_type,
      body.sender_id,
      body.receiver_id
    );
  }

  /**
   * Generate automated purchase order
   * POST /api/v1/edi/generate-po
   */
  @Post('generate-po')
  async generatePurchaseOrder(
    @Body() body: {
      buyer_id: string;
      supplier_id: string;
      items: Array<{
        product_id: string;
        quantity: number;
        requested_delivery_date?: Date;
      }>;
    }
  ) {
    return this.ediService.generateAutomatedPurchaseOrder(
      body.buyer_id,
      body.supplier_id,
      body.items
    );
  }

  /**
   * Validate document against order
   * POST /api/v1/edi/validate/:documentId/:orderId
   */
  @Post('validate/:documentId/:orderId')
  async validateDocument(
    @Param('documentId') documentId: string,
    @Param('orderId') orderId: string
  ) {
    return this.ediService.validateDocumentAgainstOrder(documentId, orderId);
  }

  /**
   * Import existing EDI system
   * POST /api/v1/edi/import-system
   */
  @Post('import-system')
  async importEdiSystem(
    @Body() body: {
      system_type: string;
      connection_config: any;
      supplier_id: string;
    }
  ) {
    return this.ediService.importExistingEdiSystem(
      body.system_type,
      body.connection_config,
      body.supplier_id
    );
  }

  /**
   * Upload EDI document file
   * POST /api/v1/edi/upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEdiFile(
    @UploadedFile() file: any,
    @Body() body: {
      document_type: EdiDocumentType;
      format: EdiFormat;
      sender_id: string;
      receiver_id: string;
    }
  ) {
    // Read file content and process
    const content = file.buffer.toString('utf-8');
    
    return this.ediService.processIncomingDocument(
      content,
      body.format,
      body.document_type,
      body.sender_id,
      body.receiver_id
    );
  }

  /**
   * Get EDI documents by supplier
   * GET /api/v1/edi/documents/supplier/:supplierId
   */
  @Get('documents/supplier/:supplierId')
  async getDocumentsBySupplier(
    @Param('supplierId') supplierId: string,
    @Query('status') status?: string,
    @Query('type') type?: string
  ) {
    // Implementation to fetch documents
    return {
      supplier_id: supplierId,
      documents: [],
      filters: { status, type }
    };
  }

  /**
   * Get EDI system status
   * GET /api/v1/edi/status
   */
  @Get('status')
  async getEdiStatus() {
    return {
      status: 'operational',
      features: {
        automated_po_generation: true,
        document_validation: true,
        error_prevention: true,
        inventory_notifications: true,
        document_scanning: true
      },
      supported_formats: ['EDIFACT', 'X12', 'XML', 'JSON', 'CSV'],
      supported_documents: [
        'Purchase Orders',
        'Invoices',
        'Product Catalogs',
        'Price Catalogs',
        'Inventory Updates',
        'Shipping Notices'
      ]
    };
  }
}
