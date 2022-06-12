import { ErrorHandler, Injectable } from "@angular/core";
import { MonitoringService } from "../services/monitoring.service";

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

    constructor(private monitoringService: MonitoringService) {
        super();
    }

    handleError(error: Error): void {
      this.monitoringService.logException(error); // Manually log exception
    }
}
