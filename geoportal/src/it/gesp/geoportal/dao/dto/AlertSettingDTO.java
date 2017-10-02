package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.constants.AlertSettings;
import it.gesp.geoportal.dao.entities.AlertSetting;

import java.util.ArrayList;
import java.util.List;

public class AlertSettingDTO {

	private String alertAddedMessage;

	public List<AlertSetting> getSettings() {
		List<AlertSetting> list = new ArrayList<AlertSetting>();

		list.add(new AlertSetting(AlertSettings.ALERTS_ADDED_NOTE_MESSAGE,
				getAlertAddedMessage()));
		
		return list;
	}

	public String getAlertAddedMessage() {
		return alertAddedMessage;
	}

	public void setAlertAddedMessage(String alertAddedMessage) {
		this.alertAddedMessage = alertAddedMessage;
	}
}