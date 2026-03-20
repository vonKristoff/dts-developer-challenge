package uk.gov.hmcts.reform.dev.repository;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import uk.gov.hmcts.reform.dev.models.Task;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class SqliteTaskRepository {

    private static final String DB_FILE = "/data/tasks.db";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    @Value("${app.data.dir:}")
    private String dataDir;

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + DB_FILE);
    }

    @PostConstruct
    public void init() {
        try (Connection conn = getConnection()) {
            String createTable = """
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    status TEXT,
                    due_date TEXT,
                    created_date TEXT NOT NULL
                )
            """;
            conn.createStatement().execute(createTable);

            ResultSet rs = conn.createStatement().executeQuery("SELECT COUNT(*) FROM tasks");
            if (rs.next() && rs.getInt(1) == 0) {
                String insert = """
                    INSERT INTO tasks (title, description, status, due_date, created_date)
                    VALUES (?, ?, ?, ?, ?)
                """;
                try (PreparedStatement stmt = conn.prepareStatement(insert)) {
                    stmt.setString(1, "Task Title");
                    stmt.setString(2, "Task Description");
                    stmt.setString(3, "Open");
                    stmt.setString(4, LocalDate.now().plusDays(7).format(DATE_FORMAT));
                    stmt.setString(5, LocalDateTime.now().toString());
                    stmt.executeUpdate();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to initialize database", e);
        }
    }

    public List<Task> findAll() {
        List<Task> tasks = new ArrayList<>();
        String sql = "SELECT id, title, description, status, due_date, created_date FROM tasks ORDER BY id";
        
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                tasks.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to load tasks", e);
        }
        return tasks;
    }

    public Optional<Task> findById(Long id) {
        String sql = "SELECT id, title, description, status, due_date, created_date FROM tasks WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to load task", e);
        }
        return Optional.empty();
    }

    public Task save(Task task) {
        if (task.getId() == null) {
            return insert(task);
        } else {
            return update(task);
        }
    }

    private Task insert(Task task) {
        String sql = """
            INSERT INTO tasks (title, description, status, due_date, created_date)
            VALUES (?, ?, ?, ?, ?)
        """;
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            LocalDateTime now = LocalDateTime.now();
            stmt.setString(1, task.getTitle());
            stmt.setString(2, task.getDescription());
            stmt.setString(3, task.getStatus());
            stmt.setString(4, task.getDueDate() != null ? task.getDueDate().format(DATE_FORMAT) : null);
            stmt.setString(5, now.toString());
            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                task.setId(rs.getLong(1));
            }
            task.setCreatedDate(now);
            
            return task;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to insert task", e);
        }
    }

    private Task update(Task task) {
        String sql = """
            UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?
            WHERE id = ?
        """;
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, task.getTitle());
            stmt.setString(2, task.getDescription());
            stmt.setString(3, task.getStatus());
            stmt.setString(4, task.getDueDate() != null ? task.getDueDate().format(DATE_FORMAT) : null);
            stmt.setLong(5, task.getId());
            stmt.executeUpdate();
            
            return task;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to update task", e);
        }
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM tasks WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete task", e);
        }
    }

    private Task mapRow(ResultSet rs) throws SQLException {
        Task task = new Task();
        task.setId(rs.getLong("id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
        String dueDateStr = rs.getString("due_date");
        task.setDueDate(dueDateStr != null ? LocalDate.parse(dueDateStr, DATE_FORMAT) : null);
        String createdDateStr = rs.getString("created_date");
        task.setCreatedDate(createdDateStr != null ? LocalDateTime.parse(createdDateStr) : null);
        return task;
    }
}
