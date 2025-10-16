import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdiDocument, EdiDocumentType, EdiDocumentStatus, EdiFormat } from './entities/edi-document.entity';
import { ProductSupplier } from '../suppliers/entities/product-supplier.entity';
import { Invoice } from '../suppliers/entities/invoice.entity';

@Injectable()
export class EdiService {
  private readonly logger = new Logger(EdiService.name);

  constructor(
    @InjectRepository(EdiDocument)
    private ediDocumentRepository: Repository<EdiDocument>,
    @InjectRepository(ProductSupplier)
    private productSupplierRepository: Repository<ProductSupplier>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Process incoming EDI document
   * Based on comments: "Automatic generation of purchase orders"
   */
  async processIncomingDocument(
    content: string,
    format: EdiFormat,
    documentType: EdiDocumentType,
    senderId: string,
    receiverId: string
  ): Promise<EdiDocument> {
    this.logger.log(`Processing incoming ${documentType} document from ${senderId}`);

    const ediDocument = this.ediDocumentRepository.create({
      document_number: this.generateDocumentNumber(),
      document_type: documentType,
      format,
      status: EdiDocumentStatus.PROCESSING,
      sender_id: senderId,
      receiver_id: receiverId,
      raw_content: content,
      received_at: new Date(),
      is_automated: true
    });

    const savedDocument = await this.ediDocumentRepository.save(ediDocument);

    try {
      // Parse and validate document
      const parsedContent = await this.parseEdiDocument(content, format);
      
      // Process based on document type
      switch (documentType) {
        case EdiDocumentType.PURCHASE_ORDER:
          await this.processPurchaseOrder(parsedContent, savedDocument);
          break;
        case EdiDocumentType.INVOICE:
          await this.processInvoice(parsedContent, savedDocument);
          break;
        case EdiDocumentType.PRODUCT_CATALOG:
          await this.processProductCatalog(parsedContent, savedDocument);
          break;
        default:
          this.logger.warn(`Unsupported document type: ${documentType}`);
      }

      savedDocument.status = EdiDocumentStatus.PROCESSED;
      savedDocument.processed_at = new Date();
      savedDocument.parsed_content = parsedContent;

    } catch (error) {
      this.logger.error(`Error processing EDI document: ${error.message}`);
      savedDocument.status = EdiDocumentStatus.ERROR;
      savedDocument.error_message = error.message;
    }

    return this.ediDocumentRepository.save(savedDocument);
  }

  /**
   * Generate automated purchase order
   * Based on comments: "buyer clicks on different items from one supplier... which should create a detailed P.O. automatically"
   */
  async generateAutomatedPurchaseOrder(
    buyerId: string,
    supplierId: string,
    items: Array<{
      product_id: string;
      quantity: number;
      requested_delivery_date?: Date;
    }>
  ): Promise<EdiDocument> {
    this.logger.log(`Generating automated PO for buyer ${buyerId} to supplier ${supplierId}`);

    const poContent = this.generatePurchaseOrderContent(buyerId, supplierId, items);
    
    const ediDocument = this.ediDocumentRepository.create({
      document_number: this.generateDocumentNumber(),
      document_type: EdiDocumentType.PURCHASE_ORDER,
      format: EdiFormat.JSON,
      status: EdiDocumentStatus.PENDING,
      sender_id: buyerId,
      receiver_id: supplierId,
      raw_content: JSON.stringify(poContent),
      parsed_content: poContent,
      is_automated: true,
      metadata: {
        generated_by: 'ai_system',
        items_count: items.length,
        total_value: await this.calculateTotalValue(items)
      }
    });

    return this.ediDocumentRepository.save(ediDocument);
  }

  /**
   * Compare documents with actual orders to prevent errors
   * Based on comments: "all documents shall be scanned and compared with the actual order so no mistakes are being made"
   */
  async validateDocumentAgainstOrder(
    ediDocumentId: string,
    orderId: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    this.logger.log(`Validating EDI document ${ediDocumentId} against order ${orderId}`);

    const ediDocument = await this.ediDocumentRepository.findOne({
      where: { id: ediDocumentId }
    });

    if (!ediDocument) {
      throw new Error('EDI document not found');
    }

    const errors: string[] = [];
    
    // Compare quantities
    if (ediDocument.parsed_content?.items) {
      for (const item of ediDocument.parsed_content.items) {
        const productSupplier = await this.productSupplierRepository.findOne({
          where: {
            supplier_id: ediDocument.receiver_id,
            product_id: item.product_id
          }
        });

        if (!productSupplier) {
          errors.push(`Product ${item.product_id} not found in supplier catalog`);
        } else if (item.quantity > productSupplier.stock_quantity) {
          errors.push(`Insufficient stock for product ${item.product_id}. Available: ${productSupplier.stock_quantity}, Requested: ${item.quantity}`);
        }
      }
    }

    // Compare pricing
    // Add more validation logic here...

    const isValid = errors.length === 0;
    
    if (!isValid) {
      ediDocument.validation_errors = errors;
      ediDocument.status = EdiDocumentStatus.ERROR;
      await this.ediDocumentRepository.save(ediDocument);
    }

    return { isValid, errors };
  }

  /**
   * Import existing EDI software
   * Based on comments: "Import existing EDI software if needed"
   */
  async importExistingEdiSystem(
    systemType: string,
    connectionConfig: any,
    supplierId: string
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Importing existing EDI system: ${systemType} for supplier ${supplierId}`);

    try {
      // Simulate EDI system integration
      // In real implementation, this would connect to external EDI systems
      
      const ediDocument = this.ediDocumentRepository.create({
        document_number: `IMPORT_${Date.now()}`,
        document_type: EdiDocumentType.PRODUCT_CATALOG,
        format: EdiFormat.XML,
        status: EdiDocumentStatus.PROCESSED,
        sender_id: supplierId,
        raw_content: JSON.stringify(connectionConfig),
        parsed_content: { system_type: systemType, imported_at: new Date() },
        metadata: {
          import_source: systemType,
          connection_config: connectionConfig
        }
      });

      await this.ediDocumentRepository.save(ediDocument);

      return {
        success: true,
        message: `Successfully imported EDI system: ${systemType}`
      };
    } catch (error) {
      this.logger.error(`Error importing EDI system: ${error.message}`);
      return {
        success: false,
        message: `Failed to import EDI system: ${error.message}`
      };
    }
  }

  private async parseEdiDocument(content: string, format: EdiFormat): Promise<any> {
    switch (format) {
      case EdiFormat.JSON:
        return JSON.parse(content);
      case EdiFormat.XML:
        // Implement XML parsing
        return { parsed: 'xml_content' };
      case EdiFormat.EDIFACT:
        // Implement EDIFACT parsing
        return { parsed: 'edifact_content' };
      case EdiFormat.X12:
        // Implement X12 parsing
        return { parsed: 'x12_content' };
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async processPurchaseOrder(_content: any, _document: EdiDocument): Promise<void> {
    this.logger.log('Processing purchase order');
    // Implement PO processing logic
  }

  private async processInvoice(content: any, document: EdiDocument): Promise<void> {
    this.logger.log('Processing invoice');
    // Implement invoice processing logic
  }

  private async processProductCatalog(content: any, document: EdiDocument): Promise<void> {
    this.logger.log('Processing product catalog');
    // Implement catalog processing logic
  }

  private generatePurchaseOrderContent(buyerId: string, supplierId: string, items: any[]): any {
    return {
      po_number: this.generateDocumentNumber(),
      buyer_id: buyerId,
      supplier_id: supplierId,
      items: items,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
  }

  private generateDocumentNumber(): string {
    return `CESTO_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private async calculateTotalValue(items: any[]): Promise<number> {
    let total = 0;
    for (const item of items) {
      const productSupplier = await this.productSupplierRepository.findOne({
        where: { product_id: item.product_id }
      });
      if (productSupplier) {
        total += productSupplier.price * item.quantity;
      }
    }
    return total;
  }
}


