require "selenium-webdriver"

@driver = Selenium::WebDriver.for :firefox
@driver.navigate.to "https://localhost:3000/#!/register"
body = @driver.find_element(:tag_name => 'html')
body.send_keys(:control, 'n')
main_window = @driver.window_handle
windows = @driver.window_handles
windows.each do |window|
  if main_window != window
    @new_window = window
  end
end
@driver.switch_to.window(@new_window)
@driver.navigate.to "https://localhost:3000/#!/login"
sleep(20000)
@driver.quit

