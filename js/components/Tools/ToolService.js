class ToolService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    async getTools() {
        return this.apiService.request("api/alkile/tools");
    }

    async getToolById(id) {
        return this.apiService.request(`api/alkile/tools/${id}`);
    }

    async createToolWithImages(formData) {
        return this.apiService.request("api/alkile/tools", {
            method: "POST",
            body: formData,
            headers: {},
        });
    }

    async updateToolWithImages(id, formData) {
        return this.apiService.request(`api/alkile/tools/${id}`, {
            method: "PUT",
            body: formData,
        });
    }

    async deleteTool(id) {
        return this.apiService.request(`api/alkile/tools/${id}`, {
            method: "DELETE",
        });
    }
}

export default ToolService;
