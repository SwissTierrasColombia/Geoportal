<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
    xmlns="http://www.opengis.net/sld" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    
  <NamedLayer>
    <Name>comments_sld</Name>
   
    <UserStyle>
      <Name>comments_default</Name>
      <IsDefault>1</IsDefault>
      <FeatureTypeStyle>
        <Rule>
          <Name>Single symbol</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0080</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#FF0080</CssParameter>
	          	<CssParameter name="stroke-width">3</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#FF0080</CssParameter>
          		<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#000000</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
          
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
    
    <UserStyle>
      <Name>comments_selected</Name>
      <FeatureTypeStyle>
        <Rule>
          <Name>Single symbol</Name>
          
		<PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#2E2EFE</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#2E2EFE</CssParameter>
	          	<CssParameter name="stroke-width">3</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#2E2EFE</CssParameter>
          		<CssParameter name="fill-opacity">0</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#000000</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
          
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
    
    <UserStyle>
      <Name>comments_hidden</Name>
      <FeatureTypeStyle>
        <Rule>
          <Name>Single symbol</Name>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill-opacity">0.0</CssParameter>
                  <CssParameter name="stroke-opacity">0.0</CssParameter>
                </Fill>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="fill-opacity">0</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#2E2EFE</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#000000</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
          
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  
  </NamedLayer>
</StyledLayerDescriptor>
