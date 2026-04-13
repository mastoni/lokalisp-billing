const CustomerService = {
  async getAllCustomers(filters) {
    // Implementation
    return [];
  },

  async getCustomerById(id) {
    // Implementation
    return null;
  },

  async createCustomer(data) {
    // Implementation
    return { id: 'new-id', ...data };
  },

  async updateCustomer(id, data) {
    // Implementation
    return { id, ...data };
  },

  async deleteCustomer(id) {
    // Implementation
    return true;
  },
};

module.exports = CustomerService;
