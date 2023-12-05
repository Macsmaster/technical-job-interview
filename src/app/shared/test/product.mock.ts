import { ProductModel } from '../../domain/models/product/product.model';

export const PRODUCT_MOCK: ProductModel = {
  id: '156',
  name: 'product 1',
  description: 'product 1 description',
  logo: 'https://picsum.photos/200/300',
  date_release: new Date(),
  date_revision: new Date(),
};

export const PRODUCTS_MOCK: ProductModel[] = [
  {
    id: '156',
    name: 'ProductA',
    description: 'product 1 description',
    logo: 'https://picsum.photos/200/300',
    date_release: new Date('2023-12-05'),
    date_revision: new Date('2023-12-05'),
  },
  {
    id: '157',
    name: 'ProductB',
    description: 'product 1 description',
    logo: 'https://picsum.photos/200/300',
    date_release: new Date('2023-12-05'),
    date_revision: new Date('2023-12-05'),
  },
  {
    id: '158',
    name: 'ProductC',
    description: 'product 1 description',
    logo: 'https://picsum.photos/200/300',
    date_release: new Date('2023-12-05'),
    date_revision: new Date('2023-12-05'),
  },
];
