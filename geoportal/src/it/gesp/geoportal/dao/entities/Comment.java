package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "comments", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_comment" }) })
public class Comment {

	private int idComment;
	
	@GsonExclude
	private User user;
	private String text;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_comment", nullable = false, unique = true)
	public int getIdComment() {
		return idComment;
	}

	public void setIdComment(int idComment) {
		this.idComment = idComment;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_user")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	@Column(name = "value")
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
}