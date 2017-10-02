package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.constants.GeneralSettings;
import it.gesp.geoportal.dao.entities.GeneralSetting;

import java.util.ArrayList;
import java.util.List;

public class GeneralSettingDTO {

	private String initialMessage;
	private String informationMessage;
	private boolean showInitialMessage;
	private boolean showInformationMessage;

	public String getInitialMessage() {
		return initialMessage;
	}

	public void setInitialMessage(String initialMessage) {
		this.initialMessage = initialMessage;
	}

	public boolean isShowInitialMessage() {
		return showInitialMessage;
	}

	public void setShowInitialMessage(boolean showInitialMessage) {
		this.showInitialMessage = showInitialMessage;
	}

	public List<GeneralSetting> getSettings() {
		List<GeneralSetting> list = new ArrayList<GeneralSetting>();

		list.add(new GeneralSetting(GeneralSettings.INITIAL_MESSAGE,
				getInitialMessage()));
		list.add(new GeneralSetting(GeneralSettings.SHOW_INITIAL_MESSAGE,
				Boolean.toString(isShowInitialMessage())));

		list.add(new GeneralSetting(GeneralSettings.INFORMATION_MESSAGE,
				getInformationMessage()));
		list.add(new GeneralSetting(GeneralSettings.SHOW_INFORMATION_MESSAGE,
				Boolean.toString(isShowInformationMessage())));
		
		return list;
	}

	public static GeneralSettingDTO parseFromSystemSettings(
			List<GeneralSetting> settings) {
		GeneralSettingDTO settingDTO = new GeneralSettingDTO();

		for (GeneralSetting s : settings) {

			if (GeneralSettings.INITIAL_MESSAGE.equals(s.getConfigKey())) {
				settingDTO.setInitialMessage(s.getConfigValue());
				continue;
			}

			if (GeneralSettings.SHOW_INITIAL_MESSAGE.equals(s.getConfigKey())) {
				String show = s.getConfigValue();
				boolean showBool = Boolean.parseBoolean(show);
				settingDTO.setShowInitialMessage(showBool);
				continue;
			}
			
			if (GeneralSettings.INITIAL_MESSAGE.equals(s.getConfigKey())) {
				settingDTO.setInitialMessage(s.getConfigValue());
				continue;
			}

			if (GeneralSettings.SHOW_INFORMATION_MESSAGE.equals(s.getConfigKey())) {
				String show = s.getConfigValue();
				boolean showBool = Boolean.parseBoolean(show);
				settingDTO.setShowInformationMessage(showBool);
				continue;
			}
			
			if (GeneralSettings.INFORMATION_MESSAGE.equals(s.getConfigKey())) {
				settingDTO.setInformationMessage(s.getConfigValue());
				continue;
			}
		}

		return settingDTO;
	}

	public String getInformationMessage() {
		return informationMessage;
	}

	public void setInformationMessage(String informationMessage) {
		this.informationMessage = informationMessage;
	}

	public boolean isShowInformationMessage() {
		return showInformationMessage;
	}

	public void setShowInformationMessage(boolean showInformationMessage) {
		this.showInformationMessage = showInformationMessage;
	}
}