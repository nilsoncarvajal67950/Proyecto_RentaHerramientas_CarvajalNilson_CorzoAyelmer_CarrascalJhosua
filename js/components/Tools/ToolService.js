class ToolService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    async getTools() {
        return this.apiService.request("/alkile/tools");
    }

    async getToolById(id) {
        return this.apiService.request(`/alkile/tools/${id}`);
    }

    async createTool(toolData) {
        return this.apiService.request("/alkile/tools", {
            method: "POST",
            body: JSON.stringify(toolData),
        });
    }

    async updateTool(id, toolData) {
        return this.apiService.request(`/alkile/tools/${id}`, {
            method: "PUT",
            body: JSON.stringify(toolData),
        });
    }

    async deleteTool(id) {
        return this.apiService.request(`/alkile/tools/${id}`, {
            method: "DELETE",
        });
    }
}

export default ToolService;