<script setup lang="ts">
    import { useCategoriesQuery } from '../composables/useCategories'
    
    const { data: categories, isLoading } = useCategoriesQuery()
    </script>
    
    <template>
      <div class="categories-page">
        <div class="categories-grid">
          <div class="category-item add-category">
            <div class="category-circle">
              <i class="pi pi-plus"></i>
            </div>
            <span class="category-name">Добавить</span>
          </div>
    
          <template v-if="!isLoading">
            <div 
              v-for="category in categories" 
              :key="category.id" 
              class="category-item"
            >
              <div 
                class="category-circle" 
                :style="{ backgroundColor: category.color || '#6366f1' }"
              >
                {{ category.icon }}
              </div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
    
    <style scoped>
    .categories-page {
      padding: 1.5rem;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .category-item:hover {
      transform: scale(1.05);
    }
    
    .category-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .add-category .category-circle {
      background-color: #e5e7eb;
      border: 2px dashed #9ca3af;
      color: #6b7280;
    }
    
    .category-name {
      font-size: 0.75rem;
      text-align: center;
      color: #4b5563;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    </style>
    
    