package uk.gov.hmcts.reform.dev.models;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Task representation")
public class Task {

    @Schema(description = "Unique identifier of the task")
    private Long id;

    @Schema(description = "Title of the task", example = "Complete project report")
    private String title;

    @Schema(description = "Detailed description of the task", example = "Write comprehensive project report for Q1")
    private String description;

    @Schema(description = "Current status of the task", example = "Open", allowableValues = {"Open", "In Progress", "Completed"})
    private String status;

    @Schema(description = "Due date for the task", example = "2026-03-25")
    private LocalDate dueDate;

    @Schema(description = "Timestamp when the task was created")
    private LocalDateTime createdDate;
}
