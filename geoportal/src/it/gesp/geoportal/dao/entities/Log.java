package it.gesp.geoportal.dao.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "logs", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_log" }) })
public class Log {

	private int idLog;
	private String context;
	private String operation;
	private User user;
	private String description;
	private Date operationTime;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_log", nullable = false, unique = true, length = 11)
	public int getIdLog() {
		return idLog;
	}

	public void setIdLog(int idLog) {
		this.idLog = idLog;
	}

	@Column(name = "operation", length = 20, nullable = false)
	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	@ManyToOne
	@JoinColumn(name="id_user")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Column(name = "description", length = 20, nullable = true)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "operation_time", nullable = false)
	public Date getOperationTime() {
		return operationTime;
	}

	public void setOperationTime(Date operationTime) {
		this.operationTime = operationTime;
	}

	@Column(name = "context", length = 20, nullable = false)
	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}
}