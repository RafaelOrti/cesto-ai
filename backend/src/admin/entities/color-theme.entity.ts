import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ColorCategory {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ACCENT = 'accent',
  BACKGROUND = 'background',
  SURFACE = 'surface',
  TEXT = 'text',
  BORDER = 'border',
  STATUS = 'status'
}

@Entity('color_themes')
export class ColorTheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  theme_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'jsonb' })
  color_config: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    accent: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    surface: {
      primary: string;
      secondary: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      hint: string;
    };
    border: {
      primary: string;
      secondary: string;
      focus: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  @Column({ type: 'varchar', length: 100, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

