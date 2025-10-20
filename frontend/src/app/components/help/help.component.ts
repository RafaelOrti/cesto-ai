import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from '../../core/services/i18n.service';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  expanded: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  searchQuery = '';
  selectedCategory = 'all';
  expandedSection: string | null = null;
  
  helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket_launch',
      content: 'Learn the basics of using CESTO AI platform',
      expanded: false
    },
    {
      id: 'suppliers',
      title: 'Managing Suppliers',
      icon: 'local_shipping',
      content: 'How to find, connect with, and manage your suppliers',
      expanded: false
    },
    {
      id: 'products',
      title: 'Product Management',
      icon: 'inventory',
      content: 'Adding, editing, and organizing your product catalog',
      expanded: false
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: 'shopping_cart',
      content: 'Creating, tracking, and managing your orders',
      expanded: false
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: 'analytics',
      content: 'Understanding your business metrics and insights',
      expanded: false
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'account_circle',
      content: 'Managing your profile and account preferences',
      expanded: false
    }
  ];
  
  faqs: FAQ[] = [
    {
      question: 'How do I add a new supplier?',
      answer: 'Go to the Suppliers section and click "Add Supplier". Fill in the required information and submit the form.',
      category: 'suppliers'
    },
    {
      question: 'How can I track my orders?',
      answer: 'Navigate to the Orders section where you can see all your orders and their current status.',
      category: 'orders'
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings > Account Settings and click on "Change Password" to update your password.',
      category: 'account'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, bank transfers, and digital payment methods.',
      category: 'orders'
    },
    {
      question: 'How do I export my data?',
      answer: 'Go to Settings and click on "Export Data" to download your information.',
      category: 'account'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact support through the chat widget, email, or phone number provided in the contact section.',
      category: 'support'
    }
  ];
  
  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'suppliers', label: 'Suppliers' },
    { value: 'products', label: 'Products' },
    { value: 'orders', label: 'Orders' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'account', label: 'Account' },
    { value: 'support', label: 'Support' }
  ];

  constructor(
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    // Initialize help content
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSection(sectionId: string): void {
    this.expandedSection = this.expandedSection === sectionId ? null : sectionId;
  }

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  get filteredFAQs(): FAQ[] {
    let filtered = this.faqs;
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  onContactSupport(): void {
    // Implement contact support functionality
    console.log('Contacting support...');
  }

  onDownloadGuide(): void {
    // Implement guide download functionality
    console.log('Downloading user guide...');
  }
}
